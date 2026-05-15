import { NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { extractFromPDF, extractFromText } from "@/lib/pdf/extractor";

export const maxDuration = 60;

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ["application/pdf", "text/plain"];

export async function POST(request: Request) {
  // 1. Auth check
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Ensure profile row exists (guards against trigger not having run at signup)
  await supabase
    .from("profiles")
    .upsert(
      { id: user.id, email: user.email! },
      { onConflict: "id", ignoreDuplicates: true }
    );

  // 2. Parse form data
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const file = formData.get("file") as File | null;
  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  // 3. Validate
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: "Only PDF and plain text files are supported" },
      { status: 400 }
    );
  }

  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json(
      { error: "File must be smaller than 10MB" },
      { status: 400 }
    );
  }

  const title = file.name.replace(/\.[^/.]+$/, ""); // strip extension

  // 4. Create document row (status: processing)
  const { data: doc, error: docError } = await supabase
    .from("documents")
    .insert({
      user_id: user.id,
      title,
      file_name: file.name,
      file_size: file.size,
      file_type: file.type,
      storage_path: "", // filled in after upload
      status: "processing",
    })
    .select()
    .single();

  if (docError || !doc) {
    console.error("[upload] Document insert error:", {
      code: docError?.code,
      message: docError?.message,
      details: docError?.details,
      hint: docError?.hint,
    });
    return NextResponse.json(
      { error: "Failed to create document record", detail: docError?.message },
      { status: 500 }
    );
  }

  const documentId = doc.id;
  const storagePath = `${user.id}/${documentId}/${file.name}`;

  try {
    // 5. Upload to Supabase Storage (service role bypasses storage RLS)
    const buffer = Buffer.from(await file.arrayBuffer());
    const serviceSupabase = createServiceClient();
    const { error: uploadError } = await serviceSupabase.storage
      .from("documents")
      .upload(storagePath, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error("[upload] Storage upload error:", uploadError);
      throw new Error(`Storage upload failed: ${uploadError.message}`);
    }

    // 6. Update storage_path
    await supabase
      .from("documents")
      .update({ storage_path: storagePath })
      .eq("id", documentId);

    // 7. Extract text
    let extraction;
    if (file.type === "application/pdf") {
      extraction = await extractFromPDF(buffer);
    } else {
      const text = buffer.toString("utf-8");
      extraction = extractFromText(text);
    }

    const { chunks, pageCount, wordCount } = extraction;

    if (chunks.length === 0) {
      throw new Error("No readable text found in document");
    }

    // 8. Insert chunks
    const chunkRows = chunks.map((chunk) => ({
      document_id: documentId,
      user_id: user.id,
      chunk_index: chunk.chunk_index,
      content: chunk.content,
      token_count: chunk.token_count,
      page_number: chunk.page_number,
    }));

    const { error: chunksError } = await supabase
      .from("document_chunks")
      .insert(chunkRows);

    if (chunksError) {
      throw new Error(`Failed to store document chunks: ${chunksError.message}`);
    }

    // 9. Update document to ready
    await supabase
      .from("documents")
      .update({
        status: "ready",
        page_count: pageCount,
        word_count: wordCount,
        updated_at: new Date().toISOString(),
      })
      .eq("id", documentId);

    return NextResponse.json({ documentId, status: "ready" });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[upload] Processing error:", message);

    // Mark document as errored
    await supabase
      .from("documents")
      .update({
        status: "error",
        error_message: message,
        updated_at: new Date().toISOString(),
      })
      .eq("id", documentId);

    return NextResponse.json({ error: message }, { status: 500 });
  }
}

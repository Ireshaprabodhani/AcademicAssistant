import pdfParse from "pdf-parse";

export interface DocumentChunk {
  chunk_index: number;
  content: string;
  token_count: number;
  page_number: number | null;
}

export interface ExtractionResult {
  chunks: DocumentChunk[];
  pageCount: number;
  wordCount: number;
}

// Rough estimate: 1 token ≈ 4 characters for English text
function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

function buildChunks(text: string): DocumentChunk[] {
  const TARGET_TOKENS = 1500;
  const paragraphs = text
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter((p) => p.length > 20);

  const chunks: DocumentChunk[] = [];
  let currentChunk = "";
  let chunkIndex = 0;

  for (const paragraph of paragraphs) {
    const combined = currentChunk ? currentChunk + "\n\n" + paragraph : paragraph;

    if (estimateTokens(combined) > TARGET_TOKENS && currentChunk.length > 0) {
      chunks.push({
        chunk_index: chunkIndex++,
        content: currentChunk.trim(),
        token_count: estimateTokens(currentChunk),
        page_number: null,
      });
      currentChunk = paragraph;
    } else {
      currentChunk = combined;
    }
  }

  if (currentChunk.trim().length > 0) {
    chunks.push({
      chunk_index: chunkIndex,
      content: currentChunk.trim(),
      token_count: estimateTokens(currentChunk),
      page_number: null,
    });
  }

  return chunks;
}

export async function extractFromPDF(buffer: Buffer): Promise<ExtractionResult> {
  const data = await pdfParse(buffer);

  const fullText = data.text;
  const pageCount = data.numpages;
  const wordCount = fullText.split(/\s+/).filter(Boolean).length;
  const chunks = buildChunks(fullText);

  return { chunks, pageCount, wordCount };
}

export function extractFromText(text: string): ExtractionResult {
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  const chunks = buildChunks(text);
  return { chunks, pageCount: 1, wordCount };
}

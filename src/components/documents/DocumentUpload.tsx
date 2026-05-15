"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useDropzone } from "react-dropzone";
import { Progress } from "@/components/ui/progress";
import { UploadCloud, FileText, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

export function DocumentUpload() {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      setUploading(true);
      setProgress(10);
      setErrorMsg(null);

      try {
        const formData = new FormData();
        formData.append("file", file);

        setProgress(30);
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        setProgress(80);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error ?? "Upload failed");
        }

        setProgress(100);
        toast({ title: "Document uploaded successfully" });
        router.push(`/documents/${data.documentId}`);
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Upload failed";
        setErrorMsg(msg);
        toast({ title: "Upload failed", description: msg, variant: "destructive" });
      } finally {
        setUploading(false);
        setProgress(0);
      }
    },
    [router]
  );

  const { getRootProps, getInputProps, isDragActive, fileRejections } =
    useDropzone({
      onDrop,
      accept: {
        "application/pdf": [".pdf"],
        "text/plain": [".txt"],
      },
      maxSize: 10 * 1024 * 1024,
      maxFiles: 1,
      disabled: uploading,
    });

  const rejectionMsg =
    fileRejections[0]?.errors[0]?.message ?? null;

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors",
          isDragActive
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25 hover:border-primary/50 hover:bg-gray-50",
          uploading && "opacity-60 cursor-not-allowed"
        )}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-3">
          {uploading ? (
            <FileText className="h-10 w-10 text-primary/60 animate-pulse" />
          ) : (
            <UploadCloud className="h-10 w-10 text-muted-foreground/50" />
          )}
          <div>
            <p className="font-medium text-sm">
              {uploading
                ? "Processing your document…"
                : isDragActive
                ? "Drop your file here"
                : "Drag & drop your file here"}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {uploading
                ? "Extracting text and preparing for Q&A"
                : "PDF or TXT · Max 10MB · or click to browse"}
            </p>
          </div>
        </div>
      </div>

      {uploading && (
        <Progress value={progress} className="mt-3 h-1.5" />
      )}

      {(errorMsg || rejectionMsg) && (
        <div className="flex items-center gap-2 mt-3 text-destructive text-sm">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{errorMsg ?? rejectionMsg}</span>
        </div>
      )}
    </div>
  );
}

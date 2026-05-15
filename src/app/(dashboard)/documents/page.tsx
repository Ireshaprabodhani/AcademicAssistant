"use client";

import { useState } from "react";
import { DocumentUpload } from "@/components/documents/DocumentUpload";
import { DocumentCard } from "@/components/documents/DocumentCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { Skeleton } from "@/components/ui/skeleton";
import { useDocuments } from "@/hooks/useDocuments";
import { toast } from "@/hooks/use-toast";
import { FileText, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DocumentsPage() {
  const { documents, loading, deleteDocument } = useDocuments();
  const [showUpload, setShowUpload] = useState(false);

  const handleDelete = async (id: string) => {
    const ok = await deleteDocument(id);
    if (ok) {
      toast({ title: "Document deleted" });
    } else {
      toast({ title: "Failed to delete document", variant: "destructive" });
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">My Documents</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Upload lecture notes, papers, or any text to start a Q&amp;A session
          </p>
        </div>
        <Button onClick={() => setShowUpload(!showUpload)} size="sm">
          <Plus className="h-4 w-4" />
          Upload document
        </Button>
      </div>

      {showUpload && (
        <div className="mb-8">
          <DocumentUpload />
        </div>
      )}

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
      ) : documents.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No documents yet"
          description="Upload your first lecture notes or research paper to get started."
          action={
            <Button onClick={() => setShowUpload(true)} size="sm">
              <Plus className="h-4 w-4" />
              Upload document
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {documents.map((doc) => (
            <DocumentCard key={doc.id} document={doc} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}

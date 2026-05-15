"use client";

import Link from "next/link";
import { FileText, Trash2, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate, formatFileSize, truncate } from "@/lib/utils";
import type { Document } from "@/types";

interface DocumentCardProps {
  document: Document;
  onDelete: (id: string) => void;
}

const statusConfig = {
  ready: {
    label: "Ready",
    variant: "success" as const,
    icon: CheckCircle,
  },
  processing: {
    label: "Processing",
    variant: "warning" as const,
    icon: Clock,
  },
  error: {
    label: "Error",
    variant: "destructive" as const,
    icon: AlertCircle,
  },
};

export function DocumentCard({ document, onDelete }: DocumentCardProps) {
  const config = statusConfig[document.status];
  const StatusIcon = config.icon;
  const isReady = document.status === "ready";

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <FileText className="h-5 w-5 text-primary" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-medium text-sm truncate">
                {truncate(document.title, 40)}
              </h3>
              <Badge variant={config.variant} className="shrink-0 flex items-center gap-1">
                <StatusIcon className="h-3 w-3" />
                {config.label}
              </Badge>
            </div>

            <p className="text-xs text-muted-foreground">
              {formatFileSize(document.file_size)}
              {document.page_count && ` · ${document.page_count} pages`}
              {document.word_count && ` · ~${document.word_count.toLocaleString()} words`}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {formatDate(document.created_at)}
            </p>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive"
            onClick={() => onDelete(document.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        {isReady && (
          <Link
            href={`/documents/${document.id}`}
            className="mt-3 flex items-center justify-center w-full py-1.5 text-xs font-medium text-primary hover:underline"
          >
            Open Q&amp;A →
          </Link>
        )}

        {document.error_message && (
          <p className="mt-2 text-xs text-destructive bg-destructive/10 rounded px-2 py-1">
            {document.error_message}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

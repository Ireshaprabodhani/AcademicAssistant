"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface TopNavProps {
  userEmail?: string;
}

export function TopNav({ userEmail }: TopNavProps) {
  const router = useRouter();

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    toast({ title: "Signed out successfully" });
    router.push("/login");
    router.refresh();
  };

  return (
    <header className="flex items-center justify-end px-6 py-3 border-b bg-white">
      <div className="flex items-center gap-3">
        {userEmail && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <User className="h-4 w-4" />
            <span>{userEmail}</span>
          </div>
        )}
        <Button variant="ghost" size="sm" onClick={handleSignOut}>
          <LogOut className="h-4 w-4" />
          Sign out
        </Button>
      </div>
    </header>
  );
}

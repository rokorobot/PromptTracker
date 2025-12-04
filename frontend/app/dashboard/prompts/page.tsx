"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PromptList } from "@/components/prompts/PromptList";
import { Plus, Search } from "lucide-react";
import Link from "next/link";
import { usePrompts, useWorkspaces } from "@/lib/hooks";
import { useToast } from "@/hooks/use-toast";

export default function PromptsPage() {
    const [search, setSearch] = useState("");
    const { toast } = useToast();

    // Get first workspace
    const { data: workspaces, isLoading: workspacesLoading } = useWorkspaces();
    const workspaceId = workspaces?.[0]?.id;

    // Fetch prompts
    const { data: prompts = [], isLoading: promptsLoading, error } = usePrompts(
        workspaceId || "",
        { search: search || undefined }
    );

    useEffect(() => {
        if (error) {
            toast({
                title: "Error",
                description: error.message || "Failed to load prompts",
                variant: "destructive",
            });
        }
    }, [error, toast]);

    const isLoading = workspacesLoading || promptsLoading;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">All Prompts</h1>
                <Button asChild disabled={!workspaceId}>
                    <Link href="/dashboard/prompts/new">
                        <Plus className="mr-2 h-4 w-4" />
                        New Prompt
                    </Link>
                </Button>
            </div>

            <div className="flex items-center gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search prompts..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-8"
                    />
                </div>
            </div>

            <PromptList prompts={prompts} isLoading={isLoading} />
        </div>
    );
}

"use client";

import { PromptCard } from "./PromptCard";
import { Skeleton } from "@/components/ui/skeleton";

interface Prompt {
    id: string;
    title: string;
    description?: string;
    tags: Array<{ tag: { name: string } }>;
    _count: { versions: number };
    updatedAt: string;
}

interface PromptListProps {
    prompts: Prompt[];
    isLoading?: boolean;
}

export function PromptList({ prompts, isLoading }: PromptListProps) {
    if (isLoading) {
        return (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                    <Skeleton key={i} className="h-40" />
                ))}
            </div>
        );
    }

    if (prompts.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-center">
                <p className="text-muted-foreground text-lg">No prompts found</p>
                <p className="text-sm text-muted-foreground mt-2">
                    Create your first prompt to get started
                </p>
            </div>
        );
    }

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {prompts.map((prompt) => (
                <PromptCard
                    key={prompt.id}
                    id={prompt.id}
                    title={prompt.title}
                    description={prompt.description}
                    tags={prompt.tags.map((t) => t.tag.name)}
                    versionCount={prompt._count.versions}
                    updatedAt={new Date(prompt.updatedAt)}
                />
            ))}
        </div>
    );
}

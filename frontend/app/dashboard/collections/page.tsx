"use client";

import React from "react";
import Link from "next/link";
import { Plus, Loader2, FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCollections, useDeleteCollection, useWorkspaces } from "@/lib/hooks";
import { CollectionCard } from "@/components/collections/CollectionCard";
import { useToast } from "@/hooks/use-toast";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function CollectionsPage() {
    const { toast } = useToast();
    const { data: workspaces } = useWorkspaces();
    const workspaceId = workspaces?.[0]?.id; // Default to first workspace for now
    const { data: collections, isLoading, error } = useCollections(workspaceId || "");
    const deleteCollection = useDeleteCollection();

    const [deleteId, setDeleteId] = React.useState<string | null>(null);

    const handleDelete = async () => {
        if (!deleteId) return;

        try {
            await deleteCollection.mutateAsync(deleteId);
            toast({
                title: "Deleted",
                description: "Collection deleted successfully.",
            });
            setDeleteId(null);
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to delete collection",
                variant: "destructive",
            });
        }
    };

    if (isLoading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex h-[50vh] flex-col items-center justify-center gap-4 text-center">
                <div className="text-destructive">Failed to load collections</div>
                <Button variant="outline" onClick={() => window.location.reload()}>
                    Retry
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Collections</h1>
                    <p className="text-muted-foreground">
                        Organize your prompts into collections.
                    </p>
                </div>
                <Button asChild>
                    <Link href="/dashboard/collections/new">
                        <Plus className="mr-2 h-4 w-4" />
                        New Collection
                    </Link>
                </Button>
            </div>

            {collections?.length === 0 ? (
                <div className="flex h-[400px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center animate-in fade-in-50">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                        <FolderOpen className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold">No collections yet</h3>
                    <p className="mb-4 mt-2 text-sm text-muted-foreground max-w-sm">
                        Create a collection to organize your prompts. You can group related prompts together for easier access.
                    </p>
                    <Button asChild>
                        <Link href="/dashboard/collections/new">
                            <Plus className="mr-2 h-4 w-4" />
                            Create Collection
                        </Link>
                    </Button>
                </div>
            ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {collections?.map((collection: any) => (
                        <CollectionCard
                            key={collection.id}
                            collection={collection}
                            onDelete={setDeleteId}
                        />
                    ))}
                </div>
            )}

            <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the
                            collection. Prompts within the collection will NOT be deleted,
                            but they will be removed from this collection.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {deleteCollection.isPending ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                "Delete"
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}

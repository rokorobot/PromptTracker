"use client";

import React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Pencil, Trash2, Loader2, FolderOpen } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { useCollection, useDeleteCollection, usePrompts, useWorkspaces } from "@/lib/hooks";
import { PromptCard } from "@/components/prompts/PromptCard";
import { useToast } from "@/hooks/use-toast";

export default function CollectionDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { toast } = useToast();
    const id = params.id as string;

    const { data: workspaces } = useWorkspaces();
    const workspaceId = workspaces?.[0]?.id;

    const { data: collection, isLoading: isLoadingCollection, error: collectionError } = useCollection(id);
    const { data: prompts, isLoading: isLoadingPrompts } = usePrompts(workspaceId || "", { collectionId: id });
    const deleteCollection = useDeleteCollection();

    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);

    const handleDelete = async () => {
        try {
            await deleteCollection.mutateAsync(id);
            toast({
                title: "Deleted",
                description: "Collection deleted successfully.",
            });
            router.push("/dashboard/collections");
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to delete collection",
                variant: "destructive",
            });
        }
    };

    if (isLoadingCollection) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (collectionError || !collection) {
        return (
            <div className="flex h-[50vh] flex-col items-center justify-center gap-4 text-center">
                <div className="text-destructive">Collection not found</div>
                <Button variant="outline" asChild>
                    <Link href="/dashboard/collections">Back to Collections</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="space-y-4">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/dashboard/collections">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div className="flex-1">
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-bold tracking-tight">{collection.name}</h1>
                            <Badge variant="outline">
                                {prompts?.length || 0} prompts
                            </Badge>
                        </div>
                        {collection.description && (
                            <p className="mt-1 text-muted-foreground">{collection.description}</p>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" asChild>
                            <Link href={`/dashboard/collections/${id}/edit`}>
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit
                            </Link>
                        </Button>
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => setIsDeleteDialogOpen(true)}
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                        </Button>
                    </div>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground pl-12">
                    <div>
                        Created {formatDistanceToNow(new Date(collection.createdAt), { addSuffix: true })}
                    </div>
                    <div>•</div>
                    <div>
                        Updated {formatDistanceToNow(new Date(collection.updatedAt), { addSuffix: true })}
                    </div>
                </div>
            </div>

            {/* Prompts List */}
            <div className="space-y-4">
                <h2 className="text-lg font-semibold tracking-tight">Prompts in this Collection</h2>

                {isLoadingPrompts ? (
                    <div className="flex justify-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                ) : prompts?.length === 0 ? (
                    <div className="flex h-[200px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                            <FolderOpen className="h-6 w-6 text-primary" />
                        </div>
                        <h3 className="mt-4 text-lg font-semibold">No prompts yet</h3>
                        <p className="mb-4 mt-2 text-sm text-muted-foreground">
                            Add prompts to this collection when creating or editing a prompt.
                        </p>
                        <Button asChild>
                            <Link href="/dashboard/prompts/new">
                                Create Prompt
                            </Link>
                        </Button>
                    </div>
                ) : (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {prompts?.map((prompt: any) => (
                            <PromptCard
                                key={prompt.id}
                                id={prompt.id}
                                title={prompt.title}
                                description={prompt.description}
                                tags={prompt.tags.map((t: any) => t.tag.name)}
                                versionCount={prompt._count?.versions || 0}
                                updatedAt={new Date(prompt.updatedAt)}
                            />
                        ))}
                    </div>
                )}
            </div>

            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Collection?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete the collection "{collection.name}".
                            Prompts within this collection will NOT be deleted, but they will be removed from this collection.
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

"use client";

import React from "react";
import { usePrompt, useDeletePrompt, useCreateVersion } from "@/lib/hooks";
import { useParams, useRouter } from "next/navigation";
import { Loader2, Copy, Pencil, Trash2, ArrowLeft, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { formatDistanceToNow } from "date-fns";
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
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function PromptDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { toast } = useToast();
    const id = params.id as string;
    const { data: prompt, isLoading, error } = usePrompt(id);
    const deletePrompt = useDeletePrompt();
    const createVersion = useCreateVersion();
    const [isNewVersionOpen, setIsNewVersionOpen] = React.useState(false);
    const [newVersionContent, setNewVersionContent] = React.useState("");

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-[50vh]">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (error || !prompt) {
        return (
            <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
                <p className="text-muted-foreground">Prompt not found or error loading.</p>
                <Button asChild variant="outline">
                    <Link href="/dashboard/prompts">Back to Prompts</Link>
                </Button>
            </div>
        );
    }

    // Sort versions by versionNumber descending to get latest
    const sortedVersions = [...prompt.versions].sort((a, b) => b.versionNumber - a.versionNumber);
    const latestVersion = sortedVersions[0];

    const copyToClipboard = () => {
        if (latestVersion?.content) {
            navigator.clipboard.writeText(latestVersion.content);
            toast({
                title: "Copied!",
                description: "Prompt content copied to clipboard.",
            });
        }
    };

    const handleDelete = async () => {
        try {
            await deletePrompt.mutateAsync(id);
            toast({
                title: "Deleted",
                description: "Prompt deleted successfully.",
            });
            router.push("/dashboard/prompts");
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to delete prompt",
                variant: "destructive",
            });
        }
    };

    const handleCreateVersion = async () => {
        if (!newVersionContent.trim()) {
            toast({
                title: "Error",
                description: "Version content cannot be empty",
                variant: "destructive",
            });
            return;
        }

        try {
            await createVersion.mutateAsync({ promptId: id, content: newVersionContent });
            toast({
                title: "Success",
                description: "New version created successfully!",
            });
            setIsNewVersionOpen(false);
            setNewVersionContent("");
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to create version",
                variant: "destructive",
            });
        }
    };

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            {/* New Version Dialog */}
            <Dialog open={isNewVersionOpen} onOpenChange={setIsNewVersionOpen}>
                <DialogContent className="max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>Create New Version</DialogTitle>
                        <DialogDescription>
                            Create a new version of this prompt. The version number will be automatically incremented.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium mb-2 block">
                                Prompt Content *
                            </label>
                            <Textarea
                                placeholder="Enter your prompt content..."
                                value={newVersionContent}
                                onChange={(e) => setNewVersionContent(e.target.value)}
                                rows={15}
                                className="font-mono"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsNewVersionOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleCreateVersion} disabled={createVersion.isPending}>
                            {createVersion.isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                "Create Version"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/dashboard/prompts">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <div className="flex-1 min-w-0">
                    <h1 className="text-3xl font-bold tracking-tight truncate">{prompt.title}</h1>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                        <span>Updated {formatDistanceToNow(new Date(prompt.updatedAt), { addSuffix: true })}</span>
                        <span>•</span>
                        <span>{prompt.versions.length} versions</span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" asChild>
                        <Link href={`/dashboard/prompts/${id}/edit`}>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit
                        </Link>
                    </Button>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This will permanently delete this prompt and all its versions. This action cannot be undone.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                    Delete
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </div>

            <div className="flex gap-2 flex-wrap">
                {prompt.tags.map((t: any) => (
                    <Badge key={t.tag.name} variant="secondary">
                        {t.tag.name}
                    </Badge>
                ))}
            </div>

            {prompt.description && (
                <p className="text-lg text-muted-foreground">{prompt.description}</p>
            )}

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-base font-medium">Latest Version (v{latestVersion?.versionNumber})</CardTitle>
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" onClick={copyToClipboard}>
                            <Copy className="h-4 w-4 mr-2" />
                            Copy
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => setIsNewVersionOpen(true)}>
                            <Plus className="h-4 w-4 mr-2" />
                            New Version
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="bg-muted p-4 rounded-lg overflow-x-auto">
                        <pre className="whitespace-pre-wrap font-mono text-sm">
                            {latestVersion?.content || "No content"}
                        </pre>
                    </div>
                </CardContent>
            </Card>

            {/* Version History */}
            {sortedVersions.length > 1 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Version History</CardTitle>
                        <CardDescription>
                            {sortedVersions.length} versions • Click to expand and view content
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {sortedVersions.map((version, index) => (
                            <VersionItem
                                key={version.id}
                                version={version}
                                isLatest={index === 0}
                                onCopy={(content) => {
                                    navigator.clipboard.writeText(content);
                                    toast({
                                        title: "Copied!",
                                        description: `Version ${version.versionNumber} content copied to clipboard.`,
                                    });
                                }}
                            />
                        ))}
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

// Version Item Component with expand/collapse
function VersionItem({ version, isLatest, onCopy }: {
    version: any;
    isLatest: boolean;
    onCopy: (content: string) => void;
}) {
    const [isExpanded, setIsExpanded] = React.useState(false);

    return (
        <div className="border rounded-lg p-4 space-y-3">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <div className="flex items-center gap-2">
                        <Badge variant={isLatest ? "default" : "secondary"}>
                            v{version.versionNumber}
                        </Badge>
                        {isLatest && (
                            <Badge variant="outline">Latest</Badge>
                        )}
                    </div>
                    <div className="mt-2 text-sm text-muted-foreground">
                        Created {formatDistanceToNow(new Date(version.createdAt), { addSuffix: true })}
                        {version.createdBy && ` by ${version.createdBy.name}`}
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onCopy(version.content)}
                    >
                        <Copy className="h-4 w-4 mr-2" />
                        Copy
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsExpanded(!isExpanded)}
                    >
                        {isExpanded ? "Collapse" : "Expand"}
                    </Button>
                </div>
            </div>

            {/* Content Preview (first 100 chars) */}
            {!isExpanded && (
                <div className="text-sm text-muted-foreground">
                    {version.content.substring(0, 100)}
                    {version.content.length > 100 && "..."}
                </div>
            )}

            {/* Full Content (when expanded) */}
            {isExpanded && (
                <div className="bg-muted p-4 rounded-lg overflow-x-auto">
                    <pre className="whitespace-pre-wrap font-mono text-sm">
                        {version.content}
                    </pre>
                </div>
            )}
        </div>
    );
}

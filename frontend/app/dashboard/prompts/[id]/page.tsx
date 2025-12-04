"use client";

import { usePrompt, useDeletePrompt } from "@/lib/hooks";
import { useParams, useRouter } from "next/navigation";
import { Loader2, Copy, Pencil, Trash2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
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
                    <Button variant="ghost" size="sm" onClick={copyToClipboard}>
                        <Copy className="h-4 w-4 mr-2" />
                        Copy
                    </Button>
                </CardHeader>
                <CardContent>
                    <div className="bg-muted p-4 rounded-lg overflow-x-auto">
                        <pre className="whitespace-pre-wrap font-mono text-sm">
                            {latestVersion?.content || "No content"}
                        </pre>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

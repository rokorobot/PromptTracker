"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { usePrompt } from "@/lib/hooks";
import { useToast } from "@/hooks/use-toast";
import { useApiClient } from "@/lib/services/api";

export default function EditPromptPage() {
    const router = useRouter();
    const params = useParams();
    const { toast } = useToast();
    const id = params.id as string;
    const { data: prompt, isLoading } = usePrompt(id);
    const { fetchApi } = useApiClient();

    const [formData, setFormData] = useState({
        title: prompt?.title || "",
        description: prompt?.description || "",
        tags: prompt?.tags.map((t: any) => t.tag.name).join(", ") || "",
    });

    const [isSaving, setIsSaving] = useState(false);

    // Update form when prompt loads
    if (prompt && !formData.title) {
        setFormData({
            title: prompt.title,
            description: prompt.description || "",
            tags: prompt.tags.map((t: any) => t.tag.name).join(", "),
        });
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            await fetchApi(`/prompts/${id}`, {
                method: 'PATCH',
                body: JSON.stringify({
                    title: formData.title,
                    description: formData.description || undefined,
                    tags: formData.tags ? formData.tags.split(",").map(t => t.trim()).filter(Boolean) : [],
                }),
            });

            toast({
                title: "Success",
                description: "Prompt updated successfully!",
            });

            router.push(`/dashboard/prompts/${id}`);
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to update prompt",
                variant: "destructive",
            });
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-[50vh]">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (!prompt) {
        return (
            <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
                <p className="text-muted-foreground">Prompt not found.</p>
                <Button asChild variant="outline">
                    <Link href="/dashboard/prompts">Back to Prompts</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href={`/dashboard/prompts/${id}`}>
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <h1 className="text-3xl font-bold tracking-tight">Edit Prompt</h1>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Update prompt details</CardTitle>
                    <CardDescription>
                        Modify the title, description, and tags. To update the content, create a new version.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="title">Title *</Label>
                            <Input
                                id="title"
                                placeholder="e.g., Blog Post Generator"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                placeholder="What does this prompt do?"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                rows={3}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="tags">Tags</Label>
                            <Input
                                id="tags"
                                placeholder="marketing, blog, seo (comma-separated)"
                                value={formData.tags}
                                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                            />
                            <p className="text-sm text-muted-foreground">
                                Separate tags with commas
                            </p>
                        </div>

                        <div className="flex gap-4">
                            <Button type="submit" disabled={isSaving}>
                                {isSaving ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    "Save Changes"
                                )}
                            </Button>
                            <Button type="button" variant="outline" asChild>
                                <Link href={`/dashboard/prompts/${id}`}>Cancel</Link>
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}

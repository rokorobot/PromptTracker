"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useCreatePrompt, useWorkspaces } from "@/lib/hooks";
import { useToast } from "@/hooks/use-toast";

export default function NewPromptPage() {
    const router = useRouter();
    const { toast } = useToast();
    const createPrompt = useCreatePrompt();
    const { data: workspaces } = useWorkspaces();

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        content: "",
        tags: "",
    });

    const workspaceId = workspaces?.[0]?.id;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!workspaceId) {
            toast({
                title: "Error",
                description: "No workspace found. Please create a workspace first.",
                variant: "destructive",
            });
            return;
        }

        try {
            await createPrompt.mutateAsync({
                workspaceId,
                title: formData.title,
                description: formData.description || undefined,
                content: formData.content,
                tags: formData.tags ? formData.tags.split(",").map(t => t.trim()).filter(Boolean) : undefined,
            });

            toast({
                title: "Success",
                description: "Prompt created successfully!",
            });

            router.push("/dashboard/prompts");
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to create prompt",
                variant: "destructive",
            });
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/dashboard/prompts">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <h1 className="text-3xl font-bold tracking-tight">New Prompt</h1>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Create a new prompt</CardTitle>
                    <CardDescription>
                        Add a new prompt to your workspace. You can create versions later.
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
                            <Label htmlFor="content">Prompt Content *</Label>
                            <Textarea
                                id="content"
                                placeholder="Enter your prompt here..."
                                value={formData.content}
                                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                rows={10}
                                required
                                className="font-mono"
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
                            <Button type="submit" disabled={createPrompt.isPending || !workspaceId}>
                                {createPrompt.isPending ? "Creating..." : "Create Prompt"}
                            </Button>
                            <Button type="button" variant="outline" asChild>
                                <Link href="/dashboard/prompts">Cancel</Link>
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}

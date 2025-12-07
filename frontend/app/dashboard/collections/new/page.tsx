"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useCreateCollection, useWorkspaces } from "@/lib/hooks";

const formSchema = z.object({
    name: z.string().min(1, "Name is required").max(50, "Name must be less than 50 characters"),
    description: z.string().max(200, "Description must be less than 200 characters").optional(),
});

export default function NewCollectionPage() {
    const router = useRouter();
    const { toast } = useToast();
    const { data: workspaces } = useWorkspaces();
    const workspaceId = workspaces?.[0]?.id;
    const createCollection = useCreateCollection();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            description: "",
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        if (!workspaceId) {
            toast({
                title: "Error",
                description: "No workspace found",
                variant: "destructive",
            });
            return;
        }

        try {
            await createCollection.mutateAsync({
                workspaceId,
                name: values.name,
                description: values.description,
            });

            toast({
                title: "Success",
                description: "Collection created successfully",
            });

            router.push("/dashboard/collections");
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to create collection",
                variant: "destructive",
            });
        }
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/dashboard/collections">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Create Collection</h1>
                    <p className="text-muted-foreground">
                        Create a new collection to organize your prompts.
                    </p>
                </div>
            </div>

            <div className="border rounded-lg p-6 bg-card">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g. Marketing Prompts" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        A unique name for your collection.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Optional description..."
                                            className="resize-none"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Briefly describe what this collection is for.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-end gap-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.push("/dashboard/collections")}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={createCollection.isPending}>
                                {createCollection.isPending && (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                Create Collection
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    );
}

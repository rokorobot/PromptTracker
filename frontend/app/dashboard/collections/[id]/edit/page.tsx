"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
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
import { useCollection, useUpdateCollection } from "@/lib/hooks";

const formSchema = z.object({
    name: z.string().min(1, "Name is required").max(50, "Name must be less than 50 characters"),
    description: z.string().max(200, "Description must be less than 200 characters").optional(),
});

export default function EditCollectionPage() {
    const params = useParams();
    const router = useRouter();
    const { toast } = useToast();
    const id = params.id as string;

    const { data: collection, isLoading: isLoadingCollection } = useCollection(id);
    const updateCollection = useUpdateCollection();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            description: "",
        },
    });

    // Reset form when collection data loads
    React.useEffect(() => {
        if (collection) {
            form.reset({
                name: collection.name,
                description: collection.description || "",
            });
        }
    }, [collection, form]);

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            await updateCollection.mutateAsync({
                id,
                name: values.name,
                description: values.description,
            });

            toast({
                title: "Success",
                description: "Collection updated successfully",
            });

            router.push(`/dashboard/collections/${id}`);
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to update collection",
                variant: "destructive",
            });
        }
    }

    if (isLoadingCollection) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href={`/dashboard/collections/${id}`}>
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Edit Collection</h1>
                    <p className="text-muted-foreground">
                        Update your collection details.
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
                                onClick={() => router.push(`/dashboard/collections/${id}`)}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={updateCollection.isPending}>
                                {updateCollection.isPending && (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                Save Changes
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    );
}

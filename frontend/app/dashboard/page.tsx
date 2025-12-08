"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Loader2 } from "lucide-react";
import Link from "next/link";
import { useWorkspaces, usePrompts } from "@/lib/hooks";
import { formatDistanceToNow } from "date-fns";

export default function DashboardPage() {
    const { data: workspaces } = useWorkspaces();
    const workspaceId = workspaces?.[0]?.id;
    const { data: prompts, isLoading } = usePrompts(workspaceId || "");

    // Calculate stats
    const totalPrompts = prompts?.length || 0;
    const totalRuns = prompts?.reduce((acc: number, prompt: any) => {
        return acc + (prompt.versions?.[0]?._count?.runs || 0);
    }, 0) || 0;

    // Get recent prompts (last 5)
    const recentPrompts = prompts?.slice(0, 5) || [];

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-[50vh]">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <Button asChild>
                    <Link href="/dashboard/prompts/new">
                        <Plus className="mr-2 h-4 w-4" />
                        New Prompt
                    </Link>
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Prompts</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalPrompts}</div>
                        <p className="text-xs text-muted-foreground">
                            {totalPrompts === 0 ? "Create your first prompt" : "Across all collections"}
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Runs</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalRuns}</div>
                        <p className="text-xs text-muted-foreground">
                            {totalRuns === 0 ? "No runs logged yet" : "Total prompt executions"}
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Versions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {prompts?.reduce((acc: number, p: any) => acc + p.versions.length, 0) || 0}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            All prompt versions
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Collections</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">0</div>
                        <p className="text-xs text-muted-foreground">
                            Coming soon
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Recent Prompts</CardTitle>
                        <CardDescription>
                            {totalPrompts === 0
                                ? "You haven't created any prompts yet."
                                : `Your ${recentPrompts.length} most recent prompts`
                            }
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {recentPrompts.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-40 text-muted-foreground gap-4">
                                <p>No prompts found</p>
                                <Button asChild variant="outline">
                                    <Link href="/dashboard/prompts/new">
                                        <Plus className="mr-2 h-4 w-4" />
                                        Create Your First Prompt
                                    </Link>
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {recentPrompts.map((prompt: any) => (
                                    <Link
                                        key={prompt.id}
                                        href={`/dashboard/prompts/${prompt.id}`}
                                        className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent transition-colors"
                                    >
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium truncate">{prompt.title}</p>
                                            <p className="text-sm text-muted-foreground truncate">
                                                {prompt.description || "No description"}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-4 ml-4">
                                            <div className="text-sm text-muted-foreground">
                                                {prompt.versions.length} {prompt.versions.length === 1 ? "version" : "versions"}
                                            </div>
                                            <div className="text-xs text-muted-foreground">
                                                {formatDistanceToNow(new Date(prompt.updatedAt), { addSuffix: true })}
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                                {totalPrompts > 5 && (
                                    <Button asChild variant="outline" className="w-full">
                                        <Link href="/dashboard/prompts">
                                            View All Prompts
                                        </Link>
                                    </Button>
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                        <CardDescription>
                            Your recent prompt updates.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {prompts && prompts.length > 0 ? (
                            <div className="space-y-4">
                                {prompts.slice(0, 5).map((prompt: any) => (
                                    <div key={prompt.id} className="flex items-start gap-3">
                                        <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                                        <div className="flex-1 min-w-0">
                                            <Link
                                                href={`/dashboard/prompts/${prompt.id}`}
                                                className="font-medium hover:underline truncate block"
                                            >
                                                {prompt.title}
                                            </Link>
                                            <p className="text-xs text-muted-foreground">
                                                Updated {formatDistanceToNow(new Date(prompt.updatedAt), { addSuffix: true })}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-40 text-muted-foreground">
                                No activity yet
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

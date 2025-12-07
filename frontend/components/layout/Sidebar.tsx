"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Library, FolderOpen, Settings, Loader2 } from "lucide-react";
import { useCollections, useWorkspaces } from "@/lib/hooks";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> { }

export function Sidebar({ className }: SidebarProps) {
    const pathname = usePathname();
    const { data: workspaces } = useWorkspaces();
    const workspaceId = workspaces?.[0]?.id;
    const { data: collections, isLoading } = useCollections(workspaceId || "");

    return (
        <div className={cn("pb-12", className)}>
            <div className="space-y-4 py-4">
                <div className="px-3 py-2">
                    <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
                        Overview
                    </h2>
                    <div className="space-y-1">
                        <Button variant={pathname === "/dashboard" ? "secondary" : "ghost"} className="w-full justify-start" asChild>
                            <Link href="/dashboard">
                                <LayoutDashboard className="mr-2 h-4 w-4" />
                                Dashboard
                            </Link>
                        </Button>
                        <Button variant={pathname === "/dashboard/prompts" ? "secondary" : "ghost"} className="w-full justify-start" asChild>
                            <Link href="/dashboard/prompts">
                                <Library className="mr-2 h-4 w-4" />
                                All Prompts
                            </Link>
                        </Button>
                        <Button variant={pathname === "/dashboard/collections" ? "secondary" : "ghost"} className="w-full justify-start" asChild>
                            <Link href="/dashboard/collections">
                                <FolderOpen className="mr-2 h-4 w-4" />
                                Collections
                            </Link>
                        </Button>
                        <Button variant={pathname === "/dashboard/settings" ? "secondary" : "ghost"} className="w-full justify-start" asChild>
                            <Link href="/dashboard/settings">
                                <Settings className="mr-2 h-4 w-4" />
                                Settings
                            </Link>
                        </Button>
                    </div>
                </div>
                <div className="px-3 py-2">
                    <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
                        Collections
                    </h2>
                    <ScrollArea className="h-[300px] px-1">
                        <div className="space-y-1 p-2">
                            {isLoading ? (
                                <div className="flex justify-center py-4">
                                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                                </div>
                            ) : collections?.length === 0 ? (
                                <div className="text-sm text-muted-foreground px-4 py-2">
                                    No collections yet
                                </div>
                            ) : (
                                collections?.map((collection: any) => (
                                    <Button
                                        key={collection.id}
                                        variant={pathname === `/dashboard/collections/${collection.id}` ? "secondary" : "ghost"}
                                        className="w-full justify-start font-normal truncate"
                                        asChild
                                    >
                                        <Link href={`/dashboard/collections/${collection.id}`}>
                                            <FolderOpen className="mr-2 h-4 w-4 shrink-0" />
                                            <span className="truncate">{collection.name}</span>
                                        </Link>
                                    </Button>
                                ))
                            )}
                        </div>
                    </ScrollArea>
                </div>
            </div>
        </div>
    );
}

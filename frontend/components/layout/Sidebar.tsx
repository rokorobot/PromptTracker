import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Library, FolderOpen, Settings } from "lucide-react";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> { }

export function Sidebar({ className }: SidebarProps) {
    return (
        <div className={cn("pb-12", className)}>
            <div className="space-y-4 py-4">
                <div className="px-3 py-2">
                    <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
                        Overview
                    </h2>
                    <div className="space-y-1">
                        <Button variant="secondary" className="w-full justify-start" asChild>
                            <Link href="/dashboard">
                                <LayoutDashboard className="mr-2 h-4 w-4" />
                                Dashboard
                            </Link>
                        </Button>
                        <Button variant="ghost" className="w-full justify-start" asChild>
                            <Link href="/dashboard/prompts">
                                <Library className="mr-2 h-4 w-4" />
                                All Prompts
                            </Link>
                        </Button>
                        <Button variant="ghost" className="w-full justify-start" asChild>
                            <Link href="/dashboard/collections">
                                <FolderOpen className="mr-2 h-4 w-4" />
                                Collections
                            </Link>
                        </Button>
                        <Button variant="ghost" className="w-full justify-start" asChild>
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
                            {/* Map collections here */}
                            <Button variant="ghost" className="w-full justify-start font-normal">
                                <FolderOpen className="mr-2 h-4 w-4" />
                                SaaS Marketing
                            </Button>
                            <Button variant="ghost" className="w-full justify-start font-normal">
                                <FolderOpen className="mr-2 h-4 w-4" />
                                Email Campaigns
                            </Button>
                            <Button variant="ghost" className="w-full justify-start font-normal">
                                <FolderOpen className="mr-2 h-4 w-4" />
                                Blog Posts
                            </Button>
                        </div>
                    </ScrollArea>
                </div>
            </div>
        </div>
    );
}

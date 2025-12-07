import React from "react";
import Link from "next/link";
import { Folder, MoreVertical, Pencil, Trash2, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface CollectionCardProps {
    collection: {
        id: string;
        name: string;
        description?: string;
        updatedAt: string;
        _count?: {
            prompts: number;
        };
    };
    onDelete?: (id: string) => void;
}

export function CollectionCard({ collection, onDelete }: CollectionCardProps) {
    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-primary/10 rounded-md">
                        <Folder className="h-4 w-4 text-primary" />
                    </div>
                    <CardTitle className="text-lg font-semibold line-clamp-1">
                        <Link href={`/dashboard/collections/${collection.id}`} className="hover:underline">
                            {collection.name}
                        </Link>
                    </CardTitle>
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreVertical className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                            <Link href={`/dashboard/collections/${collection.id}/edit`}>
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit
                            </Link>
                        </DropdownMenuItem>
                        {onDelete && (
                            <DropdownMenuItem
                                className="text-destructive focus:text-destructive"
                                onClick={() => onDelete(collection.id)}
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                            </DropdownMenuItem>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
            </CardHeader>
            <CardContent>
                <CardDescription className="line-clamp-2 min-h-[2.5rem]">
                    {collection.description || "No description provided."}
                </CardDescription>
            </CardContent>
            <CardFooter className="flex justify-between text-xs text-muted-foreground">
                <Badge variant="secondary" className="font-normal">
                    {collection._count?.prompts || 0} prompts
                </Badge>
                <div className="flex items-center">
                    <Clock className="mr-1 h-3 w-3" />
                    {formatDistanceToNow(new Date(collection.updatedAt), { addSuffix: true })}
                </div>
            </CardFooter>
        </Card>
    );
}

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";

interface PromptCardProps {
    id: string;
    title: string;
    description?: string;
    tags: string[];
    versionCount: number;
    updatedAt: Date;
}

export function PromptCard({ id, title, description, tags, versionCount, updatedAt }: PromptCardProps) {
    return (
        <Link href={`/dashboard/prompts/${id}`}>
            <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
                <CardHeader>
                    <div className="flex items-start justify-between">
                        <div className="space-y-1">
                            <CardTitle className="text-lg">{title}</CardTitle>
                            {description && (
                                <CardDescription className="line-clamp-2">{description}</CardDescription>
                            )}
                        </div>
                        <Badge variant="secondary">{versionCount} versions</Badge>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between">
                        <div className="flex gap-2 flex-wrap">
                            {tags.map((tag) => (
                                <Badge key={tag} variant="outline">
                                    {tag}
                                </Badge>
                            ))}
                        </div>
                        <span className="text-sm text-muted-foreground">
                            {formatDistanceToNow(updatedAt, { addSuffix: true })}
                        </span>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}

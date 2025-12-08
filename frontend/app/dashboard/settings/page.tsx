"use client";

import { useUser, UserProfile } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Moon, Sun, User as UserIcon, Settings as SettingsIcon } from "lucide-react";

export default function SettingsPage() {
    const { user, isLoaded } = useUser();
    const { theme, setTheme } = useTheme();

    if (!isLoaded) {
        return <div>Loading...</div>;
    }

    return (
        <div className="space-y-6 max-w-4xl">
            <div className="flex items-center gap-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                    <SettingsIcon className="h-6 w-6 text-primary" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                    <p className="text-muted-foreground">
                        Manage your account settings and preferences.
                    </p>
                </div>
            </div>

            <div className="grid gap-6">
                {/* Profile Section */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <UserIcon className="h-5 w-5" />
                            Profile
                        </CardTitle>
                        <CardDescription>
                            Your personal account information.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-4">
                            <img
                                src={user?.imageUrl}
                                alt={user?.fullName || "User"}
                                className="h-16 w-16 rounded-full border"
                            />
                            <div>
                                <h3 className="font-medium text-lg">{user?.fullName}</h3>
                                <p className="text-sm text-muted-foreground">{user?.primaryEmailAddress?.emailAddress}</p>
                            </div>
                        </div>
                        <div className="pt-4">
                            <Button variant="outline" onClick={() => window.open('https://accounts.clerk.com/user', '_blank')}>
                                Manage Account
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Appearance Section */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                            <span className="ml-6 dark:ml-0">Appearance</span>
                        </CardTitle>
                        <CardDescription>
                            Customize the look and feel of the application.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label htmlFor="theme-mode">Dark Mode</Label>
                                <p className="text-sm text-muted-foreground">
                                    Switch between light and dark themes.
                                </p>
                            </div>
                            <Switch
                                id="theme-mode"
                                checked={theme === "dark"}
                                onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

"use client";

import { SignIn, SignedIn, SignedOut, SignOutButton } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Page() {
    return (
        <div className="flex flex-col items-center justify-center gap-4">
            <SignedOut>
                <SignIn />
            </SignedOut>
            <SignedIn>
                <div className="text-center space-y-4 p-8 bg-card rounded-lg border shadow-sm">
                    <h2 className="text-2xl font-bold">You are already signed in</h2>
                    <p className="text-muted-foreground">
                        You can go to the dashboard or sign out to switch accounts.
                    </p>
                    <div className="flex flex-col gap-2">
                        <Button asChild>
                            <Link href="/dashboard">Go to Dashboard</Link>
                        </Button>
                        <SignOutButton>
                            <Button variant="outline">Sign Out</Button>
                        </SignOutButton>
                    </div>
                </div>
            </SignedIn>
        </div>
    );
}

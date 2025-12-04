"use client";

import { useSyncUser } from "@/lib/hooks";
import { useUser } from "@clerk/nextjs";
import { useEffect, useRef } from "react";

export function UserSync() {
    const { user, isLoaded } = useUser();
    const syncUser = useSyncUser();
    const syncedRef = useRef(false);

    useEffect(() => {
        if (isLoaded && user && !syncedRef.current) {
            syncedRef.current = true;
            syncUser.mutate({
                name: user.fullName || user.username || "User",
                imageUrl: user.imageUrl,
            });
        }
    }, [isLoaded, user, syncUser]);

    return null;
}

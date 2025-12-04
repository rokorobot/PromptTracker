import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { QueryProvider } from "@/lib/query-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "PromptTracker - Organize & Analyze Your LLM Prompts",
    description: "Save, version, and track the performance of your LLM prompts with team collaboration features.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ClerkProvider
            signInFallbackRedirectUrl="/dashboard"
            signUpFallbackRedirectUrl="/dashboard"
        >
            <html lang="en">
                <body className={inter.className}>
                    <QueryProvider>{children}</QueryProvider>
                </body>
            </html>
        </ClerkProvider>
    );
}

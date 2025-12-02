import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";

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
        <ClerkProvider>
            <html lang="en">
                <body className={inter.className}>{children}</body>
            </html>
        </ClerkProvider>
    );
}

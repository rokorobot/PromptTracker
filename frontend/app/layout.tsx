import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { QueryProvider } from "@/lib/query-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { UserSync } from "@/components/auth/UserSync";

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
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="system"
                        enableSystem
                        disableTransitionOnChange
                    >
                        <QueryProvider>
                            <UserSync />
                            {children}
                        </QueryProvider>
                    </ThemeProvider>
                </body>
            </html>
        </ClerkProvider>
    );
}

export default function Home() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
            <div className="text-center space-y-6 p-8">
                <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                    PromptTracker
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl">
                    Organize, version, and analyze your LLM prompts with powerful team collaboration features.
                </p>
                <div className="flex gap-4 justify-center pt-4">
                    <a
                        href="/sign-in"
                        className="px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors"
                    >
                        Get Started
                    </a>
                    <a
                        href="/dashboard"
                        className="px-6 py-3 bg-white dark:bg-gray-800 text-purple-600 dark:text-purple-400 rounded-lg font-semibold border-2 border-purple-600 hover:bg-purple-50 dark:hover:bg-gray-700 transition-colors"
                    >
                        View Dashboard
                    </a>
                </div>
            </div>
        </div>
    );
}

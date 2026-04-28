import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const loginUrl = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/auth/github`;

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center p-6 md:p-24">
      <div className="relative z-10 flex w-full max-w-md flex-col items-center justify-center overflow-hidden rounded-2xl border border-zinc-200 bg-white/50 p-8 shadow-xl backdrop-blur-xl dark:border-zinc-800 dark:bg-black/50">
        {/* Abstract Background Element*/}
        <div className="absolute -left-32 -top-32 -z-10 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 -z-10 h-64 w-64 rounded-full bg-violet-500/10 blur-3xl" />

        <div className="mb-8 flex flex-col items-center gap-2 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/20">
            <span className="text-4xl font-bold leading-none">I</span>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
            Welcome to Insighta Labs+
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Secure, centralized profile intelligence platform.
          </p>
        </div>

        <div className="w-full space-y-4">
          <a
            href={loginUrl}
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-11 px-8 w-full bg-[#24292F] text-white hover:bg-[#24292F]/90 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
          >
            <svg
              className="mr-2 h-5 w-5"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            Continue with GitHub
          </a>

          <p className="px-8 text-center text-xs text-zinc-500 dark:text-zinc-400">
            By clicking continue, you will be redirected to GitHub to authorize
            access to your account.
          </p>
        </div>
      </div>
    </div>
  );
}

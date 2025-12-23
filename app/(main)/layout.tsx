import { ReactNode } from "react";
import Link from "next/link";

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-white via-white/95 to-white dark:from-zinc-900 dark:via-zinc-900/95 dark:to-zinc-900">
      <header className="sticky top-0 z-50 w-full border-b border-primary/10 bg-gradient-to-r from-white via-white/95 to-white dark:from-zinc-900 dark:via-zinc-900/95 dark:to-zinc-900 backdrop-blur-lg shadow-lg">
        <div className="container mx-auto flex h-16 max-w-screen-2xl items-center px-4">
          <div className="mr-4 flex">
            <Link href="/dashboard" className="mr-6 flex items-center space-x-2 group">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200">
                <span className="text-white text-sm font-bold">💪</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">FitTrack</span>
            </Link>
          </div>
          <nav className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
            <div className="flex gap-2">
              <Link
                href="/dashboard"
                className="text-sm font-semibold px-4 py-2 rounded-lg transition-all duration-200 hover:bg-primary/10 hover:text-primary hover:scale-105 flex items-center gap-2"
              >
                📊 Dashboard
              </Link>
              <Link
                href="/activities"
                className="text-sm font-semibold px-4 py-2 rounded-lg transition-all duration-200 hover:bg-primary/10 hover:text-primary hover:scale-105 flex items-center gap-2"
              >
                ⚡ Activities
              </Link>
              <Link
                href="/profile"
                className="text-sm font-semibold px-4 py-2 rounded-lg transition-all duration-200 hover:bg-primary/10 hover:text-primary hover:scale-105 flex items-center gap-2"
              >
                👤 Profile
              </Link>
            </div>
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t border-primary/10 bg-gradient-to-r from-muted/20 to-muted/10">
        <div className="container mx-auto flex h-16 max-w-screen-2xl items-center justify-between px-4">
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <span>© {new Date().getFullYear()}</span>
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent font-semibold">FitTrack</span>
            <span>All rights reserved.</span>
          </p>
          <div className="flex gap-4">
            <Link
              href="/about"
              className="text-sm text-muted-foreground transition-colors hover:text-primary hover:scale-105 duration-200"
            >
              About
            </Link>
            <Link
              href="/privacy"
              className="text-sm text-muted-foreground transition-colors hover:text-primary hover:scale-105 duration-200"
            >
              Privacy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

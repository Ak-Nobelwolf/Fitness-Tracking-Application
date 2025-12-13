import { ReactNode } from "react";
import Link from "next/link";

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 max-w-screen-2xl items-center px-4">
          <div className="mr-4 flex">
            <Link href="/dashboard" className="mr-6 flex items-center space-x-2">
              <span className="text-xl font-bold">FitTrack</span>
            </Link>
          </div>
          <nav className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
            <div className="flex gap-6">
              <Link
                href="/dashboard"
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                Dashboard
              </Link>
              <Link
                href="/activities"
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                Activities
              </Link>
              <Link
                href="/profile"
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                Profile
              </Link>
            </div>
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t border-border bg-muted/40">
        <div className="container mx-auto flex h-16 max-w-screen-2xl items-center justify-between px-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} FitTrack. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link
              href="/about"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              About
            </Link>
            <Link
              href="/privacy"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Privacy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

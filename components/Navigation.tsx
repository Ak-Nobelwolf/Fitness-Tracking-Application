'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useOfflineQueue } from '@/hooks/useOfflineQueue';
import { Badge } from './ui/Badge';

export function Navigation() {
  const pathname = usePathname();
  const { isOnline, getPendingCount } = useOfflineQueue();
  const pendingCount = getPendingCount();

  const links = [
    { href: '/', label: '🏠 Home' },
    { href: '/profile', label: '👤 Profile' },
    { href: '/activities', label: '⚡ Activities' },
    { href: '/dashboard', label: '📊 Dashboard' },
  ];

  return (
    <nav className="bg-gradient-to-r from-white via-white/95 to-white dark:from-zinc-900 dark:via-zinc-900/95 dark:to-zinc-900 border-b border-primary/10 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex space-x-1">
            {links.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`inline-flex items-center px-4 py-2 border-b-4 text-sm font-semibold rounded-t-lg transition-all duration-200 ${
                  pathname === link.href
                    ? 'border-primary text-primary bg-gradient-to-r from-primary/10 to-primary/5 shadow-lg transform scale-105'
                    : 'border-transparent text-muted-foreground hover:border-primary/30 hover:text-primary hover:bg-primary/5'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-full px-4 py-2 border border-primary/20">
              <span className="text-xs font-semibold text-primary">💪 Fitness Tracker</span>
            </div>
            {pendingCount > 0 && (
              <Badge variant="warning" className="bg-gradient-to-r from-warning to-warning/80 text-white shadow-lg animate-pulse">
                ⏳ {pendingCount} pending
              </Badge>
            )}
            <Badge 
              variant={isOnline ? 'success' : 'error'} 
              className={`shadow-lg ${
                isOnline 
                  ? 'bg-gradient-to-r from-success to-success/80 text-white' 
                  : 'bg-gradient-to-r from-error to-error/80 text-white animate-pulse'
              }`}
            >
              {isOnline ? '🟢 Online' : '🔴 Offline'}
            </Badge>
          </div>
        </div>
      </div>
    </nav>
  );
}

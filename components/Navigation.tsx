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
    { href: '/', label: 'Home' },
    { href: '/profile', label: 'Profile' },
    { href: '/activities', label: 'Activities' },
    { href: '/dashboard', label: 'Dashboard' },
  ];

  return (
    <nav className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex space-x-8">
            {links.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  pathname === link.href
                    ? 'border-blue-500 text-zinc-900 dark:text-zinc-50'
                    : 'border-transparent text-zinc-500 hover:border-zinc-300 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-3">
            {pendingCount > 0 && (
              <Badge variant="warning">
                {pendingCount} pending
              </Badge>
            )}
            <Badge variant={isOnline ? 'success' : 'error'}>
              {isOnline ? 'Online' : 'Offline'}
            </Badge>
          </div>
        </div>
      </div>
    </nav>
  );
}

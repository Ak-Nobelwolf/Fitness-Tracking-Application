'use client';

import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      <div className="text-center mb-12 pt-8">
        <h1 className="text-4xl sm:text-5xl font-bold text-zinc-900 dark:text-zinc-50 mb-4">
          Fitness Tracker
        </h1>
        <p className="text-xl text-zinc-600 dark:text-zinc-400">
          Track your activities, monitor your progress, achieve your goals
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Card className="text-center">
          <div className="mb-4 text-4xl">👤</div>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-2">
            Profile
          </h3>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
            Set up your personal information and preferences
          </p>
          <Link href="/profile">
            <Button className="w-full">Go to Profile</Button>
          </Link>
        </Card>

        <Card className="text-center">
          <div className="mb-4 text-4xl">🏃</div>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-2">
            Activities
          </h3>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
            Log and manage your fitness activities
          </p>
          <Link href="/activities">
            <Button className="w-full">View Activities</Button>
          </Link>
        </Card>

        <Card className="text-center">
          <div className="mb-4 text-4xl">📊</div>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-2">
            Dashboard
          </h3>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
            Visualize your progress with charts and stats
          </p>
          <Link href="/dashboard">
            <Button className="w-full">View Dashboard</Button>
          </Link>
        </Card>
      </div>

      <Card>
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-4">
          Features
        </h2>
        <ul className="space-y-3 text-zinc-700 dark:text-zinc-300">
          <li className="flex items-start gap-2">
            <span className="text-green-500 mt-1">✓</span>
            <span>Track multiple activity types with MET-based calorie calculations</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500 mt-1">✓</span>
            <span>Manual calorie override with soft warnings for unusual values</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500 mt-1">✓</span>
            <span>Offline support - log activities even without internet connection</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500 mt-1">✓</span>
            <span>Comprehensive dashboard with daily, weekly, and monthly charts</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500 mt-1">✓</span>
            <span>Filter and search through your activity history</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500 mt-1">✓</span>
            <span>Mobile-first responsive design</span>
          </li>
        </ul>
      </Card>
    </div>
  );
}

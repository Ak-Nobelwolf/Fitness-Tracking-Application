'use client';

import { useEffect } from 'react';
import { redirect } from 'next/navigation';

export default function Home() {
  useEffect(() => {
    redirect('/dashboard');
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6">
      <div className="text-center mb-16 pt-12">
        <div className="mb-8">
          <div className="mx-auto h-24 w-24 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-2xl mb-6">
            <span className="text-4xl">💪</span>
          </div>
          <h1 className="text-5xl sm:text-7xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-6">
            Fitness Tracker
          </h1>
          <p className="text-xl sm:text-2xl text-muted-foreground max-w-2xl mx-auto">
            Track your activities, monitor your progress, achieve your goals
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <div className="group cursor-pointer transform transition-all duration-300 hover:scale-105">
          <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-8 border-2 border-primary/20 hover:border-primary/40 hover:shadow-2xl transition-all duration-300">
            <div className="mb-6 text-5xl group-hover:scale-110 transition-transform duration-300">👤</div>
            <h3 className="text-xl font-bold text-foreground mb-3">
              Profile
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              Set up your personal information and preferences to customize your fitness journey
            </p>
          </div>
        </div>

        <div className="group cursor-pointer transform transition-all duration-300 hover:scale-105">
          <div className="bg-gradient-to-br from-secondary/10 to-secondary/5 rounded-2xl p-8 border-2 border-secondary/20 hover:border-secondary/40 hover:shadow-2xl transition-all duration-300">
            <div className="mb-6 text-5xl group-hover:scale-110 transition-transform duration-300">⚡</div>
            <h3 className="text-xl font-bold text-foreground mb-3">
              Activities
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              Log and manage your fitness activities with detailed tracking and calorie calculations
            </p>
          </div>
        </div>

        <div className="group cursor-pointer transform transition-all duration-300 hover:scale-105">
          <div className="bg-gradient-to-br from-success/10 to-success/5 rounded-2xl p-8 border-2 border-success/20 hover:border-success/40 hover:shadow-2xl transition-all duration-300">
            <div className="mb-6 text-5xl group-hover:scale-110 transition-transform duration-300">📊</div>
            <h3 className="text-xl font-bold text-foreground mb-3">
              Dashboard
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              Visualize your progress with beautiful charts and comprehensive statistics
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-primary/5 via-secondary/5 to-primary/5 rounded-3xl border-2 border-primary/20 p-8 shadow-2xl">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-8 text-center">
          ✨ Amazing Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { icon: '🔥', text: 'Track multiple activity types with MET-based calorie calculations' },
            { icon: '⚡', text: 'Manual calorie override with smart warnings for unusual values' },
            { icon: '📱', text: 'Offline support - log activities even without internet connection' },
            { icon: '📈', text: 'Comprehensive dashboard with daily, weekly, and monthly charts' },
            { icon: '🔍', text: 'Filter and search through your complete activity history' },
            { icon: '📲', text: 'Mobile-first responsive design that works everywhere' },
          ].map((feature, index) => (
            <div key={index} className="flex items-start gap-3 group">
              <span className="text-2xl group-hover:scale-125 transition-transform duration-200">{feature.icon}</span>
              <span className="text-foreground leading-relaxed">{feature.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

"use client";

import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { BarChart3, Briefcase, User } from 'lucide-react';

const navItems = [
  {
    name: 'Finance',
    href: '/finance',
    icon: BarChart3,
  },
  {
    name: 'Personal',
    href: '/personal',
    icon: User,
  },
  {
    name: 'Professional',
    href: '/professional',
    icon: Briefcase,
  },
];

export default function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t">
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <button
              key={item.name}
              onClick={() => router.push(item.href)}
              className={cn(
                'flex flex-col items-center justify-center w-full h-full transition-colors',
                isActive ? 'text-primary' : 'text-muted-foreground hover:text-primary'
              )}
            >
              <item.icon className={cn('h-5 w-5 mb-1', isActive && 'animate-pulse')} />
              <span className="text-xs font-medium">{item.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
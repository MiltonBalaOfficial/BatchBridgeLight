'use client';

import * as React from 'react';
import { Home, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

type MenuItem = {
  label: string;
  key: string;
  icon: React.ReactNode;
};

const menuItems: MenuItem[] = [
  { label: 'Dashboard', key: 'dashboard', icon: <Home className='h-5 w-5' /> },
  {
    label: 'Show members',
    key: 'members',
    icon: <Users className='h-5 w-5' />,
  },
];

export function MenuBar({
  activeMenu,
  onMenuChange,
  className,
}: {
  activeMenu: string;
  onMenuChange: (key: string) => void;
  className?: string;
}) {
  const handleMenuClick = (key: string) => {
    onMenuChange(key);
  };

  return (
    <nav
      aria-label='main navigation'
      className={cn('flex w-full justify-between gap-2 px-2 py-1', className)}
    >
      {menuItems.map((item) => (
        <button
          key={item.key}
          onClick={() => handleMenuClick(item.key)}
          className={cn(
            'flex flex-1 flex-col items-center justify-center gap-1 md:flex-row md:gap-2',
            'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
            'focus:ring-2 focus:ring-primary focus:outline-none',
            activeMenu === item.key
              ? 'bg-primary text-primary-foreground shadow'
              : 'text-muted-foreground hover:bg-muted hover:text-foreground'
          )}
        >
          {item.icon}
          <span className='hidden md:inline'>{item.label}</span>
        </button>
      ))}
    </nav>
  );
}

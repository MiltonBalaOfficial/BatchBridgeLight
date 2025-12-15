// explore-light-sidebar.tsx
'use client';

import * as React from 'react';
import { X } from 'lucide-react';
import Link from 'next/link';
import { useSidebar } from '@/components/ui/sidebar';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { ThemeToggle } from '@/components/theme-toggle';
import { BatchSelect } from '@/components/batch-select';
import { useUser } from '@clerk/nextjs';
import { Student } from '@/lib/types';

interface ExploreLightSidebarProps extends React.ComponentProps<typeof Sidebar> {
  batch?: string | null;
  onBatchChange?: (batch: string | null) => void;
  activeMenu?: string;
  onMenuChange?: (menu: string) => void;
  batches?: { value: string; label: string }[];
  loadingBatches?: boolean;
  currentUser?: Student | null;
}

export function ExploreLightSidebar({
  batch,
  onBatchChange,
  activeMenu,
  onMenuChange,
  batches,
  loadingBatches,
  currentUser,
  ...props
}: ExploreLightSidebarProps) {
  const { setOpenMobile } = useSidebar();
  const [variant, setVariant] = React.useState<'inset' | 'floating'>('inset');
  const { user } = useUser();

  // Handle responsive sidebar variant
  React.useEffect(() => {
    const handleResize = () => {
      setVariant(window.innerWidth < 768 ? 'floating' : 'inset');
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close sidebar
  const handleClose = () => {
    setOpenMobile(false);
  };

  return (
    <Sidebar variant={variant} className='m-0 border-r p-0' {...props}>
      <SidebarHeader className='border-b border-indigo-700 bg-indigo-600 p-0 text-white dark:border-indigo-800 dark:bg-indigo-800'>
        <div className='flex h-12 items-center justify-between px-4'>
          <div>
            <p className='float-animation text-base font-semibold text-indigo-100'>
              Explore Light
            </p>
          </div>
          <div className='flex items-center gap-2 md:hidden'>
            <ThemeToggle />
            <button
              onClick={handleClose}
              className='ml-2 border border-indigo-300 bg-transparent text-white hover:bg-indigo-700'
              aria-label='Close sidebar'
              type='button'
            >
              <X className='h-5 w-5 text-white' />
            </button>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className='pt-2'>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => onMenuChange?.('members')}
              isActive={activeMenu === 'members'}
              className='pl-4'
            >
              Explore Members
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        <div className='space-y-4 p-4'>
          {onBatchChange && (
            <BatchSelect
              value={batch || 'all'}
              onChange={onBatchChange}
              batches={batches}
              loading={loadingBatches}
              userBatch={currentUser?.admissionYear?.toString()}
            />
          )}
        </div>
      </SidebarContent>
    </Sidebar>
  );
}

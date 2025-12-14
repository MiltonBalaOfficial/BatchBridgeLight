// app-sidebar.tsx
'use client';

import * as React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useSidebar } from '@/components/ui/sidebar';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { ThemeToggle } from '@/components/theme-toggle';
import { CollegeSelect } from '@/components/college-select';
import { BatchSelect } from '@/components/batch-select';
import { useUser } from '@clerk/nextjs';

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  collegeId?: string | null;
  batch?: string | null;
  onCollegeChange?: (collegeId: string) => void;
  onBatchChange?: (batch: string | null) => void;
  activeMenu?: string;
  onMenuChange?: (menu: string) => void;
  batches?: { value: string; label: string }[];
  loadingBatches?: boolean;
}

export function AppSidebar({
  collegeId,
  batch,
  onCollegeChange,
  onBatchChange,
  activeMenu,
  onMenuChange,
  batches,
  loadingBatches,
  ...props
}: AppSidebarProps) {
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
            {/* Mobile View: Logo */}
            <div className='md:hidden'></div>

            {/* Desktop View: Catchy Line */}
            <div className='hidden md:block'>
              <p className='float-animation text-base font-semibold text-indigo-100'>
                Keeping Your College Family Bonded.
              </p>
            </div>
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
              onClick={() => onMenuChange?.('feed')}
              isActive={activeMenu === 'feed'}
              className='pl-4'
            >
              Feed
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => onMenuChange?.('academic-content')}
              isActive={activeMenu === 'academic-content'}
              className='pl-4'
            >
              Academic Content
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => onMenuChange?.('marketplace')}
              isActive={activeMenu === 'marketplace'}
              className='pl-4'
            >
              Marketplace
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
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

        {onCollegeChange && (
          <CollegeSelect
            value={collegeId || 'all'}
            onChange={onCollegeChange}
            className='py-2 pr-4 pl-8'
          />
        )}
        {collegeId && onBatchChange && (
          <BatchSelect
            value={batch || 'all'}
            onChange={onBatchChange}
            className='pr-4 pl-8'
            batches={batches}
            loading={loadingBatches}
          />
        )}
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => onMenuChange?.('dashboard')}
              isActive={activeMenu === 'dashboard'}
              className='pl-4'
            >
              Dashboard
            </SidebarMenuButton>
          </SidebarMenuItem>
          {user?.primaryEmailAddress?.emailAddress === 'mltnbla@gmail.com' && (
            <>
              <SidebarMenuItem>
                <Link href='/admin' className='w-full'>
                  <SidebarMenuButton
                    isActive={activeMenu === 'admin'}
                    className='pl-4'
                  >
                    Admin
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            </>
          )}
        </SidebarMenu>
        {/* <NavigationTree course={course} subject={subject} /> */}
      </SidebarContent>

      <SidebarFooter className='h-11 bg-gray-800 p-1'>
        <Link href='/contribute' className='w-full'>
          <Button variant='outline' className='h-9 w-full' size='lg'>
            Join as a Patron
          </Button>
        </Link>
      </SidebarFooter>
    </Sidebar>
  );
}

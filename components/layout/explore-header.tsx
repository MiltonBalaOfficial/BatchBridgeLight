'use client';

import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { ThemeToggle } from '@/components/theme-toggle';
import Logo from '@/components/branding';
import Link from 'next/link';

import { useUser, UserButton, SignInButton } from '@clerk/nextjs';

export function ExploreHeader({
  forceRedirectUrl,
  afterSignOutUrl,
}: {
  forceRedirectUrl?: string;
  afterSignOutUrl?: string;
}) {
  const { isSignedIn, isLoaded } = useUser();

  return (
    <header className='sticky top-0 z-50 border-b border-indigo-700 bg-indigo-600 text-white backdrop-blur-md dark:border-indigo-800 dark:bg-indigo-800'>
      <div className='flex h-12 items-center justify-between px-8'>
        <div className='-ml-4 flex items-center gap-6'>
          <SidebarTrigger
            size='icon'
            className='border border-indigo-300 bg-transparent text-white hover:bg-indigo-700'
          />
          <Link href='/'>
            <Logo />
          </Link>
        </div>
        <div className='hidden items-center gap-6 md:flex'>
          <ThemeToggle />
          {isLoaded ? (
            isSignedIn ? (
              <UserButton afterSignOutUrl={afterSignOutUrl} />
            ) : (
              <SignInButton
                forceRedirectUrl={forceRedirectUrl}
                signUpForceRedirectUrl={forceRedirectUrl}
              >
                <Button>Sign In</Button>
              </SignInButton>
            )
          ) : (
            <div className='h-8 w-8 rounded-full bg-muted' />
          )}
        </div>
        <div className='-mr-4 flex items-center md:hidden'>
          {isLoaded ? (
            isSignedIn ? (
              <UserButton afterSignOutUrl={afterSignOutUrl} />
            ) : (
              <SignInButton
                forceRedirectUrl={forceRedirectUrl}
                signUpForceRedirectUrl={forceRedirectUrl}
              >
                <Button className='px-2'>Sign In</Button>
              </SignInButton>
            )
          ) : (
            <div className='h-8 w-8 rounded-full bg-muted' />
          )}
        </div>
      </div>
    </header>
  );
}

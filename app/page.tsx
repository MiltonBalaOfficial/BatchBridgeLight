'use client';

import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { SignedIn, SignedOut, UserButton, useUser } from '@clerk/nextjs';
import Logo from '@/components/branding';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { ArrowRight, Menu, Facebook, Twitter, Instagram } from 'lucide-react';
import { ContributorsSection } from '@/components/landing/ContributorsSection';
import Image from 'next/image';
import Link from 'next/link';

const Home = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { user } = useUser();
  return (
    <div className='flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950'>
      {/* Header */}
      <header className='sticky top-0 z-50 border-b border-indigo-700 bg-indigo-600 text-white backdrop-blur-md dark:border-indigo-800 dark:bg-indigo-800'>
        <div className='container mx-auto flex items-center justify-between px-4 py-3'>
          <Logo />
          <nav className='hidden items-center space-x-6 md:flex'>
            <a
              href='#features'
              className='text-sm font-medium text-indigo-100 transition-colors hover:text-white dark:text-indigo-200 dark:hover:text-white'
            >
              Features
            </a>
            <ThemeToggle />
            <SignedIn>
              <Link href='/explore-light'>
                <Button size='sm'>Explore</Button>
              </Link>
            </SignedIn>
            <SignedOut>
              <Link href='/signin'>
                <Button size='sm'>Explore</Button>
              </Link>
            </SignedOut>
            <UserButton />
          </nav>
          <div className='flex items-center space-x-2 md:hidden'>
            <ThemeToggle />
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  size='icon'
                  className='border border-indigo-300 bg-transparent text-white hover:bg-indigo-700'
                >
                  <Menu className='h-6 w-6' />
                  <span className='sr-only'>Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent className='w-full bg-slate-100 dark:bg-slate-700'>
                <SheetHeader className='bg-indigo-600 py-3 text-white dark:bg-indigo-800'>
                  <SheetTitle className='px-6'>
                    <Logo />
                  </SheetTitle>
                </SheetHeader>
                <div className='mt-6 flex flex-col space-y-4 px-6'>
                  <SheetClose asChild>
                    <a
                      href='#features'
                      className='text-lg font-medium text-slate-700 transition-colors hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400'
                    >
                      Features
                    </a>
                  </SheetClose>
                  <SignedIn>
                    <Link href='/explore-light'>
                      <Button className='w-full'>Explore</Button>
                    </Link>
                  </SignedIn>
                  <SignedOut>
                    <Link href='/signin'>
                      <Button className='w-full'>Explore Now</Button>
                    </Link>
                  </SignedOut>
                  <div className='pt-4'>
                    <UserButton />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main className='flex-grow'>
        {/* Hero Section */}
        <section className='overflow-hidden bg-gradient-to-br from-[#049592] via-[#f4e3e6] to-[#1b92b4] py-20 dark:from-gray-700 dark:via-gray-800 dark:to-blue-950'>
          <div className='container mx-auto px-4'>
            <div className='grid grid-cols-1 items-center gap-8 md:grid-cols-2'>
              {/* Left Column: Content */}
              <div className='text-center md:text-left'>
                <h1 className='text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl dark:text-gray-100'>
                  <span className='mb-8 block'>Turning Batches</span>
                  <span className='mb-8 block bg-gradient-to-r from-red-600 to-purple-600 bg-clip-text text-transparent'>
                    Into
                  </span>
                  <span className='block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text pb-2 text-transparent'>
                    Lifelong Networks
                  </span>
                </h1>
                <p className='mx-auto mt-6 max-w-2xl text-lg text-gray-800 md:mx-0 dark:text-gray-300'>
                  BatchBridge is the exclusive platform for students of Colleges
                  to connect, collaborate, and build a stronger community.
                </p>
                <div className='mt-8 flex justify-center gap-4 md:justify-start'>
                  <SignedIn>
                    <Link href='/explore-light'>
                      <Button
                        size='lg'
                        className='bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:bg-blue-700'
                      >
                        Explore Now
                        <ArrowRight className='ml-2 h-5 w-5' />
                      </Button>
                    </Link>
                  </SignedIn>
                  <SignedOut>
                    <Link href='/signin'>
                      <Button
                        size='lg'
                        className='bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:bg-blue-700'
                      >
                        Explore Now
                        <ArrowRight className='ml-2 h-5 w-5' />
                      </Button>
                    </Link>
                  </SignedOut>
                </div>
              </div>
              {/* Right Column: Logo */}
              <div className='hidden flex-col items-center justify-center md:flex'>
                <div className='float-animation'>
                  <Image
                    src='/logo.png'
                    alt='BatchBridge Logo'
                    width={300}
                    height={300}
                    objectFit='contain'
                  />
                </div>
                <p className='mt-4 text-center text-lg text-gray-800 dark:text-gray-300'>
                  Connecting generations of medical professionals.
                </p>
              </div>
            </div>
          </div>
        </section>

        <ContributorsSection />

        {/* Call to Action Section */}
        <section className='bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 py-20 text-center dark:from-indigo-800 dark:via-purple-800 dark:to-pink-800'>
          <div className='container mx-auto px-4'>
            <h2 className='text-4xl font-extrabold tracking-tight text-white sm:text-5xl'>
              Ready to Connect and Grow?
            </h2>
            <p className='mx-auto mt-6 max-w-2xl text-lg text-indigo-100'>
              Join BatchBridge today and start building your lifelong network.
            </p>
            <div className='mt-8 flex justify-center gap-4'>
              <SignedIn>
                <Link href='/explore-light'>
                  <Button
                    size='lg'
                    className='bg-white text-indigo-700 hover:bg-gray-100 hover:text-indigo-800'
                  >
                    Explore Now
                    <ArrowRight className='ml-2 h-5 w-5' />
                  </Button>
                </Link>
              </SignedIn>
              <SignedOut>
                <Link href='/signin'>
                  <Button
                    size='lg'
                    className='bg-white text-indigo-700 hover:bg-gray-100 hover:text-indigo-800'
                  >
                    Get Started
                    <ArrowRight className='ml-2 h-5 w-5' />
                  </Button>
                </Link>
              </SignedOut>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className='bg-slate-900 text-slate-300'>
        <div className='container mx-auto px-4 py-16'>
          <div className='grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4'>
            {/* Branding & Disclaimer */}
            <div className='lg:col-span-1'>
              <div className='mb-4'>
                <Logo />
              </div>
              <h3 className='text-sm font-semibold tracking-wider text-indigo-400 uppercase'>
                Disclaimer
              </h3>
              <p className='mt-2 text-xs text-slate-400 italic'>
                This is an unofficial, student-run platform and is not
                affiliated with the College of Medicine and JNM Hospital
                administration.
              </p>
            </div>

            {/* Connect */}
            <div>
              <h3 className='text-sm font-semibold tracking-wider text-indigo-400 uppercase'>
                Connect With Us
              </h3>
              <p className='mt-4 text-sm text-slate-400'>
                Join the conversation on our social channels.
              </p>
              <div className='mt-4 flex space-x-4'>
                <a href='#' className='text-slate-400 hover:text-indigo-400'>
                  <Facebook className='h-6 w-6' />
                  <span className='sr-only'>Facebook</span>
                </a>
                <a href='#' className='text-slate-400 hover:text-indigo-400'>
                  <Twitter className='h-6 w-6' />
                  <span className='sr-only'>Twitter</span>
                </a>
                <a href='#' className='text-slate-400 hover:text-indigo-400'>
                  <Instagram className='h-6 w-6' />
                  <span className='sr-only'>Instagram</span>
                </a>
              </div>
            </div>
          </div>
          <div className='mt-12 border-t border-slate-800 pt-8 text-center text-sm text-slate-500'>
            <p>
              &copy; {new Date().getFullYear()} BatchBridge. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;

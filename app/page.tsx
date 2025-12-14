'use client';

import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { SignedIn, SignedOut, UserButton, useUser } from '@clerk/nextjs';
import Logo from '@/components/branding';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Play,
  ArrowRight,
  Menu,
  Users,
  Calendar,
  Network,
  MessageSquare,
  Briefcase,
  Library,
  Facebook,
  Twitter,
  Instagram,
} from 'lucide-react';
import { ContributorsSection } from '@/components/landing/ContributorsSection';
import Image from 'next/image';
import Link from 'next/link';

const Home = () => {
  const { user } = useUser();
  const features = [
    {
      icon: Users,
      title: 'Comprehensive Directory',
      description:
        'Effortlessly find and reconnect with batchmates, seniors, and juniors. Your entire college community is now just a search away.',
      color: 'bg-teal-100 text-teal-600 dark:bg-teal-900/50 dark:text-teal-400',
    },
    {
      icon: Briefcase,
      title: 'Career Launchpad',
      description:
        'Get a head start on your career with exclusive job postings, internship opportunities, and practical advice shared by experienced alumni.',
      color: 'bg-lime-100 text-lime-600 dark:bg-lime-900/50 dark:text-lime-400',
    },
    {
      icon: Network,
      title: 'Mentorship Matching',
      description:
        'Connect with experienced seniors and alumni who can guide you through your academic and professional journey. Give back by becoming a mentor yourself.',
      color:
        'bg-amber-100 text-amber-600 dark:bg-amber-900/50 dark:text-amber-400',
    },
    {
      icon: MessageSquare,
      title: 'Community Forums',
      description:
        'Share academic insights, discuss college life, or collaborate on projects in forums designed for both focused work and casual conversation.',
      color: 'bg-cyan-100 text-cyan-600 dark:bg-cyan-900/50 dark:text-cyan-400',
    },
    {
      icon: Calendar,
      title: 'Event Coordination',
      description:
        'From batch reunions to annual meet-ups, our tools make it simple to organize memorable events and keep the community spirit alive.',
      color: 'bg-rose-100 text-rose-600 dark:bg-rose-900/50 dark:text-rose-400',
    },
    {
      icon: Library,
      title: 'Resource Library',
      description:
        'Access a curated library of academic notes, project resources, and career guides shared by students and alumni to help you excel.',
      color:
        'bg-violet-100 text-violet-600 dark:bg-violet-900/50 dark:text-violet-400',
    },
  ];

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
            <Link
              href='/about'
              className='text-sm font-medium text-indigo-100 transition-colors hover:text-white dark:text-indigo-200 dark:hover:text-white'
            >
              About
            </Link>
            <ThemeToggle />
            <SignedIn>
              <Link href='/explore'>
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
                  <SheetClose asChild>
                    <Link
                      href='/about'
                      className='text-lg font-medium text-slate-700 transition-colors hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400'
                    >
                      About
                    </Link>
                  </SheetClose>
                  <SignedIn>
                    <Link href='/explore'>
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
        <section className='relative overflow-hidden bg-gradient-to-br from-[#049592] via-[#f4e3e6] to-[#1b92b4] py-20 text-center dark:from-gray-700 dark:via-gray-800 dark:to-blue-950'>
          <div className='absolute inset-0 z-0 opacity-10'>
            <Image
              src='/logo.png'
              alt='BatchBridge Logo Watermark'
              layout='fill'
              objectFit='contain'
              className='pointer-events-none'
            />
          </div>
          <div className='float-animation relative z-10 container mx-auto px-4'>
            <h1 className='text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl dark:text-gray-100'>
              <span className='mb-8 block'>Turning Batches</span>
              <span className='mb-8 block bg-gradient-to-r from-red-600 to-purple-600 bg-clip-text text-transparent'>
                Into
              </span>
              <span className='block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text pb-2 text-transparent'>
                Lifelong Networks
              </span>
            </h1>
            <p className='mx-auto mt-6 max-w-2xl text-lg text-gray-800 dark:text-gray-300'>
              BatchBridge is the exclusive platform for students of Colleges to
              connect, collaborate, and build a stronger community.
            </p>
            <div className='mt-8 flex justify-center gap-4'>
              <SignedIn>
                <Link href='/explore'>
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
              <Link href='/promo'>
                <Button
                  size='lg'
                  variant='outline'
                  className='border-green-600 bg-gray-300 text-gray-800 hover:bg-green-700 dark:border-green-400 dark:text-green-300 dark:hover:bg-green-800'
                >
                  <Play className='mr-2 h-5 w-5' />
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id='features' className='bg-slate-100 py-24 dark:bg-slate-700'>
          <div className='container mx-auto px-4'>
            <div className='mb-16 text-center'>
              <h2 className='text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-slate-100'>
                Your Digital Campus Quad
              </h2>
              <p className='mx-auto mt-4 max-w-3xl text-lg text-slate-600 dark:text-slate-300'>
                BatchBridge is more than a directory. It's a living network
                designed to help you connect with peers, share experiences, and
                unlock new opportunities.
              </p>
            </div>
            <div className='grid gap-8 md:grid-cols-2 lg:grid-cols-3'>
              {features.map((feature, index) => (
                <Card
                  key={index}
                  className='transform-gpu border-0 bg-white shadow-lg transition-transform duration-300 hover:-translate-y-2 dark:bg-slate-800'
                >
                  <CardHeader className='flex-row items-center gap-4'>
                    <div
                      className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg ${feature.color}`}
                    >
                      <feature.icon className='h-6 w-6' />
                    </div>
                    <CardTitle className='text-lg font-semibold text-slate-900 dark:text-slate-100'>
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className='text-slate-600 dark:text-slate-300'>
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
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
                <Link href='/explore'>
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

            {/* Navigation */}
            <div>
              <h3 className='text-sm font-semibold tracking-wider text-indigo-400 uppercase'>
                Navigate
              </h3>
              <ul className='mt-4 space-y-3'>
                <li>
                  <a
                    href='#features'
                    className='text-sm text-slate-400 hover:text-indigo-400'
                  >
                    Features
                  </a>
                </li>
                <li>
                  <Link
                    href='/about'
                    className='text-sm text-slate-400 hover:text-indigo-400'
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    href='/contribute'
                    className='text-sm text-slate-400 hover:text-indigo-400'
                  >
                    Contribute
                  </Link>
                </li>
                <li>
                  <Link
                    href='/promo'
                    className='text-sm text-slate-400 hover:text-indigo-400'
                  >
                    Learn More
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal & Account */}
            <div>
              <h3 className='text-sm font-semibold tracking-wider text-indigo-400 uppercase'>
                Legal & Account
              </h3>
              <ul className='mt-4 space-y-3'>
                <li>
                  <Link
                    href='/privacy'
                    className='text-sm text-slate-400 hover:text-indigo-400'
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href='/terms'
                    className='text-sm text-slate-400 hover:text-indigo-400'
                  >
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link
                    href='/contact'
                    className='text-sm text-slate-400 hover:text-indigo-400'
                  >
                    Contact Us
                  </Link>
                </li>
                <SignedIn>
                  {user?.primaryEmailAddress?.emailAddress ===
                    'mltnbla@gmail.com' && (
                    <li>
                      <Link
                        href='/admin'
                        className='text-sm text-slate-400 hover:text-indigo-400'
                      >
                        Admin Panel
                      </Link>
                    </li>
                  )}
                </SignedIn>
                <SignedOut>
                  <li>
                    <Link
                      href='/signin'
                      className='text-sm text-slate-400 hover:text-indigo-400'
                    >
                      Sign In
                    </Link>
                  </li>
                </SignedOut>
              </ul>
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

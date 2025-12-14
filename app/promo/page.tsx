'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { HomeIcon } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import Logo from '@/components/branding';

// Define video type
type Video = {
  id: number;
  youtubeId: string;
  title?: string; // fetched later
};

// Video data (only ids for now)
const videos: Video[] = [
  { id: 1, youtubeId: 'd0HkfJo1kDU' },
  { id: 2, youtubeId: 'E8WZnXQ9TTQ' },
  { id: 3, youtubeId: '3ztOezH8Rj8' },
  { id: 4, youtubeId: 'M7lc1UVf-VE' },
  { id: 5, youtubeId: 'dQw4w9WgXcQ' },
  { id: 6, youtubeId: '3JZ_D3ELwOQ' },
];

export default function PromoPage() {
  const [videoList, setVideoList] = useState<Video[]>(videos);
  const [currentVideo, setCurrentVideo] = useState<Video>(videos[0]);
  const activeRef = useRef<HTMLButtonElement | null>(null);

  const videoRef = useRef<HTMLDivElement | null>(null);
  const [videoHeight, setVideoHeight] = useState<number | null>(null);

  // Fetch YouTube titles
  useEffect(() => {
    async function fetchTitles() {
      const updated: Video[] = await Promise.all(
        videos.map(async (video) => {
          try {
            const res = await fetch(
              `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${video.youtubeId}&format=json`
            );
            if (!res.ok) throw new Error('Failed to fetch');
            const data = await res.json();
            return { ...video, title: data.title as string };
          } catch {
            return { ...video, title: 'Unknown Title' };
          }
        })
      );
      setVideoList(updated);
      setCurrentVideo(updated[0]); // keep first as default
    }
    fetchTitles();
  }, []);

  // Auto-scroll active item into view
  useEffect(() => {
    activeRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
    });
  }, [currentVideo]);

  // Sync playlist height with video height
  useEffect(() => {
    if (videoRef.current) {
      const observer = new ResizeObserver(([entry]) => {
        setVideoHeight(entry.contentRect.height);
      });
      observer.observe(videoRef.current);
      return () => observer.disconnect();
    }
  }, []);

  return (
    <div className='min-h-screen bg-gray-100 dark:bg-gray-900'>
      {/* Header */}
      <header className='sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-md dark:border-gray-800 dark:bg-gray-950/80'>
        <div className='container mx-auto flex h-14 items-center justify-between px-4'>
          <div className='flex-direction-horizontal flex'>
            <Button variant='outline' asChild>
              <Link href='/'>
                <HomeIcon className='mr-0 h-4' />
              </Link>
            </Button>
            <div className='px-4'>
              <Link href='/'>
                <Logo />
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className='container mx-auto px-4 py-2'>
        <div className='mx-auto max-w-6xl'>
          <h2 className='mb-4 text-center text-4xl font-bold text-gray-900 dark:text-gray-300'>
            See how{' '}
            <span className='text-magenta-600 dark:text-red-200'>Nemoric</span>{' '}
            can help you achieve your goals.
          </h2>

          {/* YouTube-like Layout */}
          <div className='grid gap-6 lg:grid-cols-3'>
            {/* Main Video Player */}
            <div
              ref={videoRef}
              className='relative aspect-video overflow-hidden rounded-lg shadow-2xl lg:col-span-2'
            >
              <iframe
                key={currentVideo.id}
                className='absolute inset-0 h-full w-full'
                src={`https://www.youtube.com/embed/${currentVideo.youtubeId}`}
                title={currentVideo.title || 'YouTube Video'}
                frameBorder='0'
                allow='accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
                allowFullScreen
              />
            </div>

            {/* Playlist */}
            <div
              className='space-y-4 overflow-y-auto pr-2'
              style={{ maxHeight: videoHeight ? `${videoHeight}px` : 'auto' }}
            >
              {videoList.map((video) => {
                const isActive = currentVideo.id === video.id;
                return (
                  <button
                    key={video.id}
                    ref={isActive ? activeRef : null}
                    onClick={() => setCurrentVideo(video)}
                    className={`flex w-full items-center gap-3 rounded-lg border p-2 text-left transition hover:bg-gray-100 dark:hover:bg-gray-800 ${
                      isActive
                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-950'
                        : 'border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    {/* Thumbnail */}
                    <div className='relative w-32 flex-shrink-0'>
                      <Image
                        src={`https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`}
                        alt={video.title || 'Thumbnail'}
                        width={128}
                        height={72}
                        className={`rounded-md object-cover ${
                          isActive ? 'opacity-70' : ''
                        }`}
                      />
                      {isActive && (
                        <>
                          <div className='absolute inset-0 rounded-md bg-black/50'></div>
                          <span className='absolute right-1 bottom-1 rounded bg-red-600 px-2 py-0.5 text-xs text-white shadow'>
                            ▶ Playing
                          </span>
                        </>
                      )}
                    </div>
                    <span className='line-clamp-2 text-sm font-medium text-gray-900 dark:text-gray-100'>
                      {video.title || 'Loading...'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* CTA */}
          <div className='mt-4'>
            <p className='mb-4 text-left text-lg text-gray-600 dark:text-gray-200'>
              Visit our official YouTube Channel{' '}
              <a
                href='https://www.youtube.com/@Nemoricapp'
                target='_blank'
                rel='noopener noreferrer'
                className='text-blue-600 hover:underline dark:text-blue-400'
              >
                Nemoric
              </a>
            </p>

            <h2 className='mb-2 text-center text-3xl font-bold text-gray-900 dark:text-gray-100'>
              Ready to Start Learning?
            </h2>
            <p className='mb-4 text-center text-lg text-gray-600 dark:text-gray-300'>
              Join{' '}
              <span className='text-magenta-600 dark:text-red-200'>
                Nemoric
              </span>{' '}
              today and take the first step towards acing your exams.
            </p>
            <div className='text-center'>
              <Button
                asChild
                size='lg'
                className='bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
              >
                <Link href='/signup'>Sign Up for Free</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

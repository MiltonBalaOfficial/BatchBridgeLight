'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { PlayCircle, FileText } from 'lucide-react';
import Link from 'next/link';

export function ProtectedDashboardContent() {
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const response = await fetch('/api/user');
        if (response.ok) {
          const data = await response.json();
          setUserName(data.name);
        }
      } catch (error) {
        console.error('Error fetching user name:', error);
      }
    };

    fetchUserName();
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <>
      <div className='flex items-center justify-between space-y-2 p-4 pb-0'>
        <div>
          {userName && (
            <h2 className='text-2xl font-bold'>{`${getGreeting()}, ${userName}`}</h2>
          )}
        </div>
        <div className='flex items-center space-x-2'>
          <Link href='/profile'>
            <Button>Profile</Button>
          </Link>
        </div>
      </div>

      <div className='p-4'>
        <h3 className='mt-6 text-2xl font-bold tracking-tight'>
          Pick up where you left off
        </h3>
        <div className='mt-4 grid gap-6 md:grid-cols-2'>
          {/* Placeholder Cards */}
          <Card>
            <CardHeader className='flex flex-row items-center justify-between'>
              <CardTitle>Video: Newton's Laws</CardTitle>
              <PlayCircle className='h-6 w-6 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <p className='text-sm text-muted-foreground'>
                Physics: Mechanics
              </p>
            </CardContent>
            <CardFooter>
              <Button className='w-full'>Watch Now</Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between'>
              <CardTitle>Notes: The Krebs Cycle</CardTitle>
              <FileText className='h-6 w-6 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <p className='text-sm text-muted-foreground'>
                Biology: Metabolism
              </p>
            </CardContent>
            <CardFooter>
              <Button className='w-full'>Read Notes</Button>
            </CardFooter>
          </Card>
        </div>
      </div>

      <div className='p-4'>
        <h3 className='mt-6 text-2xl font-bold tracking-tight'>My Courses</h3>
        <div className='mt-4 grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
          {/* Placeholder Course Cards */}
          {[
            { title: 'Physics: Mechanics', progress: 75 },
            { title: 'Chemistry: Organic', progress: 45 },
            { title: 'Biology: Genetics', progress: 90 },
          ].map((course) => (
            <Card key={course.title}>
              <CardHeader>
                <CardTitle>{course.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <Progress value={course.progress} className='h-2' />
                <p className='mt-2 text-sm text-muted-foreground'>
                  {course.progress}% complete
                </p>
              </CardContent>
              <CardFooter>
                <Button variant='outline' className='w-full'>
                  Go to course
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}

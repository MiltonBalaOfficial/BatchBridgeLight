'use client';

import { Student } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building, Users, GraduationCap } from 'lucide-react';

interface DashboardHomeProps {
  currentUser: Student | null;
}

export function DashboardHome({ currentUser }: DashboardHomeProps) {
  return (
    <div className='space-y-8'>
      <div>
        <h1 className='text-3xl font-bold'>
          Welcome back, {currentUser?.name_first || 'User'}!
        </h1>
        <p className='text-muted-foreground'>
          Here's a quick overview of your network.
        </p>
      </div>

      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Your College</CardTitle>
            <Building className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>[College Name]</div>
            <p className='text-xs text-muted-foreground'>
              Connect with students from your college.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Your Batchmates
            </CardTitle>
            <Users className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>[Number]</div>
            <p className='text-xs text-muted-foreground'>
              students from your batch are here.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Suggested Connections
            </CardTitle>
            <GraduationCap className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>[Number]</div>
            <p className='text-xs text-muted-foreground'>
              students you might want to connect with.
            </p>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className='mb-4 text-2xl font-bold'>Suggested for you</h2>
        <p className='text-muted-foreground'>
          Based on your profile and preferences, here are some students you
          might know. This feature is coming soon!
        </p>
      </div>
    </div>
  );
}

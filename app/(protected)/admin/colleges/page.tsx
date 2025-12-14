'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { College } from '@/lib/types';
import Link from 'next/link';
import { PlusCircle } from 'lucide-react';

const CollegesPage = () => {
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchColleges = async () => {
      try {
        const res = await fetch('/api/colleges');
        const data = await res.json();
        setColleges(data);
      } catch (error) {
        console.error('Error fetching colleges:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchColleges();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className='container mx-auto py-10'>
      <div className='mb-8 flex items-center justify-between'>
        <h1 className='text-3xl font-bold'>Colleges</h1>
        <Link href='/admin/edit/colleges/new'>
          <Button>
            <PlusCircle className='mr-2 h-4 w-4' />
            Add New College
          </Button>
        </Link>
      </div>
      <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
        {colleges.map((college) => (
          <Card key={college.id}>
            <CardHeader>
              <CardTitle>{college.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-sm text-gray-600 dark:text-gray-300'>
                {college.location}
              </p>
              <p className='text-sm text-gray-600 dark:text-gray-300'>
                Established: {college.established_year}
              </p>
              <div className='mt-4 flex justify-end'>
                <Link href={`/admin/edit/colleges/${college.id}`}>
                  <Button variant='outline'>Edit</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CollegesPage;

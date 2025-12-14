'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';

const AdminPage = () => {
  return (
    <div className='container mx-auto py-10'>
      <h1 className='mb-8 text-3xl font-bold'>Admin Dashboard</h1>
      <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
        <div className='rounded-lg bg-white p-6 shadow-md dark:bg-gray-800'>
          <h2 className='mb-4 text-xl font-semibold'>Edit Students JSON</h2>
          <p className='mb-4 text-gray-600 dark:text-gray-300'>
            Directly edit the `students.json` file.
          </p>
          <Link href='/admin/students'>
            <Button>Edit Students JSON</Button>
          </Link>
        </div>
        <div className='rounded-lg bg-white p-6 shadow-md dark:bg-gray-800'>
          <h2 className='mb-4 text-xl font-semibold'>Edit Colleges JSON</h2>
          <p className='mb-4 text-gray-600 dark:text-gray-300'>
            Directly edit the `colleges.json` file.
          </p>
          <Link href='/admin/colleges'>
            <Button>Edit Colleges JSON</Button>
          </Link>
        </div>
        <div className='rounded-lg bg-white p-6 shadow-md dark:bg-gray-800'>
          <h2 className='mb-4 text-xl font-semibold'>
            Edit Academic Content JSON
          </h2>
          <p className='mb-4 text-gray-600 dark:text-gray-300'>
            Directly edit the `academic-content.json` file.
          </p>
          <Link href='/admin/academic-content'>
            <Button>Edit Academic Content JSON</Button>
          </Link>
        </div>
        <div className='rounded-lg bg-white p-6 shadow-md dark:bg-gray-800'>
          <h2 className='mb-4 text-xl font-semibold'>
            Edit Academic Structure JSON
          </h2>
          <p className='mb-4 text-gray-600 dark:text-gray-300'>
            Edit the hierarchical `academic-structure.json` file.
          </p>
          <Link href='/admin/academic-structure-editor'>
            <Button>Edit Academic Structure</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;

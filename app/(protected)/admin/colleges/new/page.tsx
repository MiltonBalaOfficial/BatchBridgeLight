'use client';

import { CollegeForm } from '@/components/admin/college-form';

const NewCollegePage = () => {
  return (
    <div className='container mx-auto py-10'>
      <h1 className='mb-8 text-3xl font-bold'>Add New College</h1>
      <CollegeForm isNew={true} />
    </div>
  );
};

export default NewCollegePage;

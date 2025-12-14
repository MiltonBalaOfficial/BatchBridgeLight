'use client';

import { StudentForm } from '@/components/admin/student-form';

const NewStudentPage = () => {
  return (
    <div className='container mx-auto py-10'>
      <h1 className='mb-8 text-3xl font-bold'>Add New Student</h1>
      <StudentForm isNew={true} />
    </div>
  );
};

export default NewStudentPage;

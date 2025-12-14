'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { CollegeForm } from '@/components/admin/college-form';
import { College } from '@/lib/types';

const EditCollegePage = () => {
  const { id } = useParams();
  const [college, setCollege] = useState<College | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const fetchCollege = async () => {
        try {
          const res = await fetch(`/api/colleges/${id}`);
          const data = await res.json();
          setCollege(data);
        } catch (error) {
          console.error('Error fetching college:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchCollege();
    }
  }, [id]);

  if (loading) {
    return <div>Loading college data...</div>;
  }

  if (!college) {
    return <div>College not found.</div>;
  }

  return (
    <div className='container mx-auto py-10'>
      <h1 className='mb-8 text-3xl font-bold'>Edit College</h1>
      <CollegeForm college={college} />
    </div>
  );
};

export default EditCollegePage;

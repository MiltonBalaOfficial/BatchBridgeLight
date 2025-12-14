'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { StudentForm } from '@/components/admin/student-form';
import { Student } from '@/lib/types';

const EditStudentPage = () => {
  const { id } = useParams();
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const fetchStudent = async () => {
        try {
          const res = await fetch(`/api/students/${id}`);
          const data = await res.json();
          setStudent(data);
        } catch (error) {
          console.error('Error fetching student:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchStudent();
    }
  }, [id]);

  if (loading) {
    return <div>Loading student data...</div>;
  }

  if (!student) {
    return <div>Student not found.</div>;
  }

  return (
    <div className='container mx-auto py-10'>
      <h1 className='mb-8 text-3xl font-bold'>Edit Student</h1>
      <StudentForm student={student} />
    </div>
  );
};

export default EditStudentPage;

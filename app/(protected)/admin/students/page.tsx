'use client';

import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Student, College } from '@/lib/types';
import Link from 'next/link';
import { PlusCircle } from 'lucide-react';
import { Input } from '@/components/ui/input'; // Import Input component

const StudentsPage = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(''); // New state for search term

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [studentsRes, collegesRes] = await Promise.all([
          fetch('/api/students'),
          fetch('/api/colleges'),
        ]);
        const studentsData = await studentsRes.json();
        const collegesData = await collegesRes.json();
        setStudents(studentsData);
        setColleges(collegesData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDeleteStudent = async (id: string) => {
    if (confirm('Are you sure you want to delete this student?')) {
      const response = await fetch(`/api/students/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setStudents(students.filter((student) => student.id !== id));
      }
    }
  };

  const handleDeleteCollege = async (id: string) => {
    if (confirm('Are you sure you want to delete this college?')) {
      const response = await fetch(`/api/colleges/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setColleges(colleges.filter((college) => college.id !== id));
      }
    }
  };

  const filteredStudents = useMemo(() => {
    if (!searchTerm) {
      return students;
    }
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return students.filter(
      (student) =>
        student.name_first.toLowerCase().includes(lowerCaseSearchTerm) ||
        (student.name_last &&
          student.name_last.toLowerCase().includes(lowerCaseSearchTerm)) ||
        (student.collegeBatch &&
          student.collegeBatch.toLowerCase().includes(lowerCaseSearchTerm)) ||
        student.admissionYear.toString().includes(lowerCaseSearchTerm)
    );
  }, [students, searchTerm]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className='container mx-auto py-10'>
      <div className='mb-8 flex items-center justify-between'>
        <h1 className='text-3xl font-bold'>Admin Dashboard</h1>
      </div>
      <div className='grid grid-cols-1 gap-6'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between'>
            <CardTitle>Students</CardTitle>
            <Link href='/admin/students/new'>
              <Button>
                <PlusCircle className='mr-2 h-4 w-4' />
                Add New Student
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className='mb-6'>
              <Input
                type='text'
                placeholder='Search students by name, batch, or admission year...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='w-full'
              />
            </div>
            <div className='max-h-[500px] overflow-y-auto pr-4'>
              {' '}
              {/* Added scrollable container */}
              <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
                {filteredStudents.map((student) => {
                  const college = colleges.find(
                    (c) => c.id === student.collegeId
                  );
                  return (
                    <Card key={student.id}>
                      <CardHeader>
                        <CardTitle>
                          {student.name_first} {student.name_last}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {college && (
                          <p className='text-sm text-gray-600 dark:text-gray-300'>
                            {college.name}
                          </p>
                        )}
                        <p className='text-sm text-gray-600 dark:text-gray-300'>
                          Admission Year: {student.admissionYear}
                        </p>
                        <p className='text-sm text-gray-600 dark:text-gray-300'>
                          College Batch: {student.collegeBatch}
                        </p>
                        <div className='mt-4 flex justify-end'>
                          <Link href={`/admin/students/${student.id}`}>
                            <Button
                              variant='outline'
                              size='sm'
                              className='mr-2'
                            >
                              Edit
                            </Button>
                          </Link>
                          <Button
                            variant='destructive'
                            size='sm'
                            onClick={() => handleDeleteStudent(student.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between'>
            <CardTitle>Colleges</CardTitle>
            <Link href='/admin/colleges/new'>
              <Button>Add New College</Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className='space-y-2'>
              <div className='grid grid-cols-3 font-bold'>
                <div>Name</div>
                <div>Location</div>
                <div className='text-right'>Actions</div>
              </div>
              {colleges.map((college) => (
                <div key={college.id} className='grid grid-cols-3 items-center'>
                  <div>{college.name}</div>
                  <div>{college.location}</div>
                  <div className='text-right'>
                    <Link href={`/admin/colleges/${college.id}`}>
                      <Button variant='outline' size='sm' className='mr-2'>
                        Edit
                      </Button>
                    </Link>
                    <Button
                      variant='destructive'
                      size='sm'
                      onClick={() => handleDeleteCollege(college.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentsPage;

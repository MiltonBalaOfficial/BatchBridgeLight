'use client';
import { Student, College } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { checkPermission } from '@/lib/privacy-utils'; // Updated import
import { Lock } from 'lucide-react';

interface StudentGridProps {
  students: Student[];
  colleges: College[];
  onStudentClick: (student: Student) => void;
  currentUser: Student | null;
}

export function StudentGrid({
  students,
  colleges,
  onStudentClick,
  currentUser,
}: StudentGridProps) {
  return (
    <div
      className={`grid grid-cols-1 gap-4 transition-opacity duration-300 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4`}
    >
      {students.map((student) => {
        const studentCollege = colleges.find(
          (college) => college.id === student.collegeId
        );
        const isProfileVisible = checkPermission(
          student.privacy_profile,
          currentUser,
          student
        );

        if (!isProfileVisible) {
          return (
            <Card
              key={student.Id} // Corrected to student.Id
              className='flex cursor-not-allowed flex-col items-center justify-center bg-muted/50 p-4'
            >
              <div className='text-center text-muted-foreground'>
                <Lock className='mx-auto h-8 w-8' />
                <p className='mt-2 text-sm'>Profile is Private</p>
              </div>
            </Card>
          );
        }

        const isImageVisible = checkPermission(
          student.privacy_profileImage, // Corrected to privacy_profileImage
          currentUser,
          student
        );

        return (
          <Card
            key={student.Id} // Corrected to student.Id
            onClick={() => onStudentClick(student)}
            className='cursor-pointer transition-shadow hover:shadow-lg'
          >
            <CardHeader>
              <div className='relative mx-auto aspect-square w-full max-w-[160px] overflow-hidden rounded-full'>
                {isImageVisible ? (
                  <Image
                    src={
                      student.profileImage
                        ? `/api/students/${student.Id}/image` // Corrected to student.Id
                        : ''
                    }
                    alt={student.fullName || ''} // Using fullName
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                ) : (
                  <Image
                    src={`/api/students/placeholderDP.jpg/image`}
                    alt='Placeholder Profile Image'
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                )}
              </div>
            </CardHeader>
            <CardContent className='text-center'>
              <CardTitle>
                {
                  student.professionalInfo?.ProfessionalPreNominal
                    ? `${student.professionalInfo.ProfessionalPreNominal} ${student.fullName}` // Using fullName
                    : `${student.fullName}` // Using fullName
                }
              </CardTitle>
              <p className='text-muted-foreground'>
                {student.degree && `${student.degree} - `}
                {student.admissionYear} ({student.collegeBatch})
              </p>
              <p className='text-sm text-muted-foreground'>
                {studentCollege ? studentCollege.name : 'Unknown College'}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

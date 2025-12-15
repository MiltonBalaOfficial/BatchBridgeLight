'use client';
import { Student } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { checkPermission } from '@/lib/privacy-utils'; // Updated import
import { Lock } from 'lucide-react';

interface StudentGridProps {
  students: Student[];
  onStudentClick: (student: Student) => void;
  currentUser: Student | null;
}

function getOrdinal(n: number) {
  if (n > 3 && n < 21) return `${n}th`;
  switch (n % 10) {
    case 1:
      return `${n}st`;
    case 2:
      return `${n}nd`;
    case 3:
      return `${n}rd`;
    default:
      return `${n}th`;
  }
}

export function StudentGrid({
  students,
  onStudentClick,
  currentUser,
}: StudentGridProps) {
  return (
    <div
      className={`grid grid-cols-1 gap-4 transition-opacity duration-300 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4`}
    >
      {students.map((student) => {
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
          student.privacy_profile_image, // Corrected to privacy_profileImage
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
                    src={`/api/students/${student.Id}/image`}
                    alt={student.fullName || 'Student Profile Image'}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                ) : (
                  <Image
                    src={`/api/students/placeholder/image`}
                    alt='Profile Image Not Visible'
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                )}
              </div>
            </CardHeader>
            <CardContent className='text-center'>
              <CardTitle>
                {(() => {
                  let prenominal = '';
                  if (student.passedOut) {
                    prenominal = `Dr.`;
                  }
                  return prenominal
                    ? `${prenominal} ${student.fullName}`
                    : student.fullName;
                })()}
              </CardTitle>
              <p className='text-muted-foreground'>
                {student.admissionYear &&
                  `${getOrdinal(student.admissionYear - 2010 + 1)} Batch`}
              </p>
              <p className='text-sm text-muted-foreground'>COMJNMH</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

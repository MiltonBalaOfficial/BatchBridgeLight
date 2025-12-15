import { getCurrentUserStudentData } from '@/lib/user';
import studentData from '@/data/studentLight.json';
import { Student, RawStudent } from '@/lib/types';
import ExploreLightClient from './client';
import { redirect } from 'next/navigation';
import { processRawStudent } from '@/lib/student-utils';

const processStudents = (): Student[] => {
  const rawStudentArray = Object.values(
    studentData as Record<string, RawStudent>
  );
  return rawStudentArray.map(processRawStudent);
};

export default async function ExploreLightPage() {
  const currentUser = await getCurrentUserStudentData();

  if (!currentUser) {
    redirect('/not-a-student');
  }

  const students = processStudents();

  const uniqueBatches = [
    ...new Set(
      students
        .map((s) => s.admissionYear)
        .filter((year): year is number => year !== undefined)
    ),
  ];
  uniqueBatches.sort((a, b) => b - a);
  const batches = uniqueBatches.map((year) => ({
    value: year.toString(),
    label: `Batch ${year}`,
  }));

  return (
    <ExploreLightClient
      students={students}
      currentUser={currentUser}
      batches={batches}
    />
  );
}


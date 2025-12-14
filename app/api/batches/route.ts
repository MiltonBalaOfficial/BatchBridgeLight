import { NextResponse } from 'next/server';
import { getStudentsAsArray, loadData } from '@/lib/db';
import { Batch } from '@/lib/types'; // Assuming Batch is defined in lib/types.ts

export async function GET(request: Request) {
  await loadData();
  const { searchParams } = new URL(request.url);
  const collegeId = searchParams.get('collegeId');

  const students = getStudentsAsArray();

  let filteredStudents = students;
  if (collegeId && collegeId !== 'all') {
    filteredStudents = students.filter(
      (student) => student.collegeId === collegeId
    );
  }

  const batchesSet = new Set<string>();
  filteredStudents.forEach((student) => {
    if (student.admissionYear) {
      batchesSet.add(String(student.admissionYear));
    }
  });

  const batches: Batch[] = Array.from(batchesSet)
    .sort()
    .map((year) => ({
      value: year,
      label: `${year} Batch`,
    }));

  return NextResponse.json(batches);
}

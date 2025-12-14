import { NextResponse } from 'next/server';
import {
  getStudents,
  saveStudents,
  loadData,
  getStudentsAsArray,
} from '@/lib/db';
import { Student } from '@/lib/types';
import { filterStudentForClient } from '@/lib/privacy';
import { getCurrentUserStudent } from '@/lib/auth';

// Helper function to generate a unique slug
const generateSlug = (
  firstName: string,
  lastName: string,
  existingSlugs: Set<string>
): string => {
  const baseSlug = `${firstName.toLowerCase()}-${lastName.toLowerCase()}`
    .replace(/[^a-z0-9-]/g, '')
    .replace(/--+/g, '-');

  let slug = baseSlug;
  let counter = 1;
  while (existingSlugs.has(slug)) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
  return slug;
};

export async function GET(request: Request) {
  await loadData();
  const { searchParams } = new URL(request.url);
  const collegeId = searchParams.get('collegeId');
  const batch = searchParams.get('batch');

  let studentsData = getStudentsAsArray();

  if (collegeId && collegeId !== 'all') {
    studentsData = studentsData.filter(
      (student: Student) => student.collegeId === collegeId
    );
  }

  if (batch && batch !== 'all') {
    const batchNumber = parseInt(batch, 10);
    if (!isNaN(batchNumber)) {
      studentsData = studentsData.filter(
        (student: Student) => student.admissionYear === batchNumber
      );
    }
  }

  const currentUser = await getCurrentUserStudent();

  const filteredStudents = studentsData.map((student) =>
    filterStudentForClient(student, currentUser)
  );

  return NextResponse.json(filteredStudents);
}

export async function POST(request: Request) {
  await loadData();
  const newStudentData: Partial<Student> = await request.json();

  if (
    !newStudentData.id ||
    !newStudentData.name_first ||
    !newStudentData.name_last
  ) {
    return NextResponse.json(
      { message: 'Missing required fields for new student.' },
      { status: 400 }
    );
  }

  const students = getStudents();
  const existingSlugs = new Set(
    Object.values(students)
      .filter((s) => s.slug)
      .map((s) => s.slug as string)
  );

  const slug = generateSlug(
    newStudentData.name_first,
    newStudentData.name_last,
    existingSlugs
  );

  const newStudent: Student = {
    ...newStudentData,
    slug,
    role: 'student',
    accountStatus: 'active',
    deletedAt: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  } as Student;

  students[newStudent.id] = newStudent;

  await saveStudents(students);
  return NextResponse.json({
    message: 'Student created successfully',
    student: newStudent,
  });
}

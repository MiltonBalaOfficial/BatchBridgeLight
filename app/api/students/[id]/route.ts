import { NextResponse } from 'next/server';
import {
  getStudentById,
  saveStudents,
  loadData,
  getStudentsAsArray,
} from '@/lib/db';
import { Student } from '@/lib/types';
import { filterStudentForClient } from '@/lib/privacy';
import { getCurrentUserStudent } from '@/lib/auth';

export async function GET(
  request: Request,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  context: any
) {
  await loadData();
  const { id } = context.params as { id: string };
  const student = getStudentById(id);

  if (student) {
    const currentUser = await getCurrentUserStudent();
    const filteredStudent = filterStudentForClient(student, currentUser);
    return NextResponse.json(filteredStudent);
  } else {
    return new NextResponse('Student not found', { status: 404 });
  }
}

export async function PUT(
  request: Request,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  context: any
) {
  await loadData();
  const { id } = context.params as { id: string };
  const updatedStudent: Student = await request.json();
  const students: Student[] = getStudentsAsArray();
  const studentIndex = students.findIndex((s: Student) => s.id === id);

  if (studentIndex === -1) {
    return new NextResponse('Student not found', { status: 404 });
  }

  // Preserve created_at from original data
  updatedStudent.created_at = students[studentIndex].created_at;

  students[studentIndex] = updatedStudent;

  const studentsObject = students.reduce(
    (acc, student) => {
      acc[student.id] = student;
      return acc;
    },
    {} as { [key: string]: Student }
  );

  await saveStudents(studentsObject);

  return NextResponse.json({ message: 'Student updated successfully' });
}

export async function DELETE(
  request: Request,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  context: any
) {
  await loadData();
  const { id } = context.params as { id: string };
  const students: Student[] = getStudentsAsArray();
  const updatedStudents = students.filter((s: Student) => s.id !== id);

  if (students.length === updatedStudents.length) {
    return new NextResponse('Student not found', { status: 404 });
  }

  const studentsObject = updatedStudents.reduce(
    (acc, student) => {
      acc[student.id] = student;
      return acc;
    },
    {} as { [key: string]: Student }
  );

  await saveStudents(studentsObject);

  return NextResponse.json({ message: 'Student deleted successfully' });
}

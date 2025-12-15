import { currentUser } from '@clerk/nextjs/server';
import { Student, RawStudent } from '@/lib/types';
import studentData from '@/data/studentLight.json';
import { processRawStudent } from './student-utils';

export async function getCurrentUserStudentData(): Promise<Student | null> {
  try {
    const user = await currentUser();
    if (!user) {
      return null;
    }

    const email = user.emailAddresses[0]?.emailAddress;
    if (!email) {
      return null;
    }

    const students = studentData as Record<string, RawStudent>;
    const rawStudent = Object.values(students).find(
      (s) => s.contact_email === email
    );

    if (rawStudent) {
      return processRawStudent(rawStudent);
    }

    return null;
  } catch (error) {
    console.error('Error fetching current user student data:', error);
    return null;
  }
}

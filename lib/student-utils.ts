import { Student } from '@/lib/types';

export function filterStudents(
  students: Student[],
  currentUser: Student | null,
  batch: string | null
): Student[] {
  return students.filter((student) => {
    // Filter by batch
    if (
      batch &&
      batch !== 'all' &&
      student.admissionYear?.toString() !== batch
    ) {
      return false;
    }

    // Apply basic privacy: only show students whose privacy_profile is not 'onlyMe'
    // Unless the student is the current user themselves
    if (
      student.privacy_profile?.level === 'onlyMe' &&
      student.Id !== currentUser?.Id
    ) {
      return false;
    }

    return true;
  });
}

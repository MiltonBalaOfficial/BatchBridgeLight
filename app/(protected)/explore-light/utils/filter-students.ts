import { Student } from '@/lib/types';

export function filterStudents(
  students: Student[],
  currentUser: Student,
  batch: string | null
): Student[] {
  let filtered = students;

  // Filter by Batch
  if (batch && batch !== 'all') {
    filtered = filtered.filter((s) => String(s.admissionYear) === batch);
  }

  // Exclude the current user
  const initialCount = filtered.length;
  const finalFilter = filtered.filter((s) => s.id !== currentUser.id);
  const finalCount = finalFilter.length;
  console.log('Filtering current user:', {
      currentUserId: currentUser.id,
      initialCount,
      finalCount,
      wasUserFound: initialCount !== finalCount,
  });
  return finalFilter;
}

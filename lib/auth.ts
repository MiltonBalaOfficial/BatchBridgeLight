import { currentUser as getClerkUser } from '@clerk/nextjs/server';
import { loadData, getStudents, saveStudents } from '@/lib/db';
import { Student } from '@/lib/types';

/**
 * Retrieves the currently authenticated user's student profile.
 *
 * This function performs the following steps:
 * 1. Fetches the authenticated Clerk user.
 * 2. Tries to find the corresponding student profile using the `clerkUserId`.
 * 3. If not found, falls back to finding the profile by the user's primary email.
 * 4. If found by email, it "claims" the profile by saving the `clerkUserId` to it.
 * 5. Returns the full student profile if found, otherwise returns null.
 *
 * @returns {Promise<Student | null>} The full student profile or null if not found or not authenticated.
 */
export async function getCurrentUserStudent(): Promise<Student | null> {
  await loadData();
  const user = await getClerkUser();

  if (!user) {
    return null;
  }

  const clerkUserId = user.id;
  const students = getStudents();
  let studentId: string | undefined;

  // 1. Try to find the student by clerkUserId
  studentId = Object.keys(students).find(
    (id) => students[id].clerkUserId === clerkUserId
  );

  // 2. If not found, try to find by email (the "claim" process)
  if (!studentId) {
    const userEmail = user.emailAddresses[0]?.emailAddress;
    if (userEmail) {
      const studentIdByEmail = Object.keys(students).find(
        (id) => students[id].contact_email === userEmail
      );

      if (studentIdByEmail) {
        studentId = studentIdByEmail;
        console.log(
          `Linking Clerk user ${clerkUserId} to student ${studentId} via email.`
        );
        students[studentId].clerkUserId = clerkUserId;
        students[studentId].updated_at = new Date().toISOString();
        await saveStudents(students);
      }
    }
  }

  return studentId ? students[studentId] : null;
}

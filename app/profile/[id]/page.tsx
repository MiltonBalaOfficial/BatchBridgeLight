import { Student, College } from '@/lib/types';
import { ProfileView } from '@/components/profile/ProfileView';
import { getCurrentUserStudent } from '@/lib/auth'; // Import getCurrentUserStudent

// This is a server component
export default async function StudentProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: studentId } = await params;

  let student: Student | null = null;
  let colleges: College[] = [];
  let currentUser: Student | null = null; // Declare currentUser

  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const [studentsDataRes, collegesDataRes, currentUserData] =
      await Promise.all([
        fetch(`${baseUrl}/database/students.json`),
        fetch(`${baseUrl}/database/colleges.json`),
        // Fetch current user here
        getCurrentUserStudent(),
      ]);
    const studentsData: { [key: string]: Student } =
      await studentsDataRes.json();
    colleges = await collegesDataRes.json();
    currentUser = currentUserData; // Assign currentUser from the Promise.all result
    student = studentsData[studentId] || null;
  } catch (error) {
    console.error('Error fetching data:', error);
  }

  if (!student) {
    return (
      <div className='flex h-screen items-center justify-center'>
        <p className='text-xl text-muted-foreground'>Student not found.</p>
      </div>
    );
  }

  // ProfileView is a client component
  return (
    <ProfileView
      student={student}
      colleges={colleges}
      currentUser={currentUser}
    />
  );
}

import { NextResponse } from 'next/server';
import { getCurrentUserStudent } from '@/lib/auth';
import { currentUser } from '@clerk/nextjs/server';

export async function GET() {
  try {
    const studentProfile = await getCurrentUserStudent();

    if (studentProfile) {
      // Return the full, unfiltered profile for the user themselves
      return NextResponse.json(studentProfile);
    } else {
      // If user is not in our student database, treat them as a guest.
      const user = await currentUser();
      return NextResponse.json({
        role: 'guest',
        name: user?.firstName || 'Guest',
      });
    }
  } catch (error) {
    console.error('Error in /api/user:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

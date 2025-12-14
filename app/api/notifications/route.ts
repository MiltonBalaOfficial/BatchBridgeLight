import { NextResponse } from 'next/server';
import { getNotifications, loadData } from '@/lib/db';
import { getCurrentUserStudent } from '@/lib/auth';

export async function GET() {
  await loadData();
  const currentUser = await getCurrentUserStudent();
  const allNotifications = getNotifications();

  if (currentUser && allNotifications && allNotifications[currentUser.id]) {
    return NextResponse.json(allNotifications[currentUser.id]);
  }

  return NextResponse.json([]);
}

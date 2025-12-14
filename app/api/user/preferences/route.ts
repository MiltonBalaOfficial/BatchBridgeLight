import { NextResponse } from 'next/server';
import { getUserPreferences, loadData } from '@/lib/db';

export async function GET() {
  await loadData();
  const preferences = getUserPreferences();
  return NextResponse.json(preferences);
}

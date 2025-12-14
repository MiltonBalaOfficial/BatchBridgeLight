import { NextResponse } from 'next/server';
import { getColleges, loadData } from '@/lib/db';

export async function GET() {
  await loadData();
  const colleges = getColleges();
  return NextResponse.json(colleges);
}

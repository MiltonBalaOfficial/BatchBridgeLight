import { NextResponse } from 'next/server';
import { getFeed, loadData } from '@/lib/db';

export async function GET() {
  await loadData();
  const feed = getFeed();
  return NextResponse.json(feed);
}

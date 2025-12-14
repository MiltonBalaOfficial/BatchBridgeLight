import { NextResponse } from 'next/server';
import { getMarketplace, loadData } from '@/lib/db';

export async function GET() {
  await loadData();
  const marketplace = getMarketplace();
  return NextResponse.json(marketplace);
}

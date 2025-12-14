import { NextResponse } from 'next/server';
import developers from '@/data/developers.json';

export async function GET() {
  return NextResponse.json(developers);
}

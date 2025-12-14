import { NextResponse } from 'next/server';
import patrons from '@/data/patrons.json';

export async function GET() {
  return NextResponse.json(patrons);
}

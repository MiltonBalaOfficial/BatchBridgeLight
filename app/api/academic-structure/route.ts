import { NextResponse } from 'next/server';
import { getAcademicStructure, loadData } from '@/lib/db';

export async function GET() {
  await loadData();
  const academicStructure = getAcademicStructure();
  return NextResponse.json(academicStructure);
}

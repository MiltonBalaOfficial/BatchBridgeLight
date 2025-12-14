import { NextResponse } from 'next/server';
import { getAcademicContent, loadData } from '@/lib/db';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  await loadData();
  const academicContent = getAcademicContent();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (id) {
    const item = academicContent.find((item) => item.id === id);
    if (!item) {
      return NextResponse.json({ message: 'Not Found' }, { status: 404 });
    }
    return NextResponse.json(item);
  }

  return NextResponse.json(academicContent);
}

// TODO: Implement POST, PUT, and DELETE handlers using the new db functions.

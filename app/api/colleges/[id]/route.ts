import { NextResponse } from 'next/server';
import { getColleges, saveColleges, loadData } from '@/lib/db';
import { College } from '@/lib/types';

export async function GET(
  request: Request,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  context: any
) {
  await loadData();
  const { id } = context.params as { id: string };
  const colleges = getColleges();
  const college = colleges.find((c) => c.id === id);

  if (college) {
    return NextResponse.json(college);
  } else {
    return new NextResponse('College not found', { status: 404 });
  }
}

export async function PUT(
  request: Request,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  context: any
) {
  await loadData();
  const { id } = context.params as { id: string };
  const updatedCollege: College = await request.json();
  const colleges = getColleges();
  const collegeIndex = colleges.findIndex((c) => c.id === id);

  if (collegeIndex === -1) {
    return new NextResponse('College not found', { status: 404 });
  }

  colleges[collegeIndex] = updatedCollege;
  await saveColleges(colleges);

  return NextResponse.json({ message: 'College updated successfully' });
}

export async function DELETE(
  request: Request,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  context: any
) {
  await loadData();
  const { id } = context.params as { id: string };
  const colleges = getColleges();
  const updatedColleges = colleges.filter((c) => c.id !== id);

  if (colleges.length === updatedColleges.length) {
    return new NextResponse('College not found', { status: 404 });
  }

  await saveColleges(updatedColleges);

  return NextResponse.json({ message: 'College deleted successfully' });
}

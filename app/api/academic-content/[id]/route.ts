import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { AcademicContent } from '@/lib/types';

const jsonFilePath = path.resolve(
  process.cwd(),
  'public/database/academic-content.json'
);

async function readData(): Promise<AcademicContent[]> {
  try {
    const fileContent = await fs.readFile(jsonFilePath, 'utf-8');
    return JSON.parse(fileContent) as AcademicContent[];
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

async function writeData(data: AcademicContent[]): Promise<void> {
  await fs.writeFile(jsonFilePath, JSON.stringify(data, null, 2), 'utf-8');
}

export async function GET(
  _req: Request,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  context: any
) {
  try {
    const { id } = context.params as { id: string };
    const data = await readData();
    const item = data.find((item) => item.id === id);
    if (!item) {
      return NextResponse.json({ message: 'Not Found' }, { status: 404 });
    }
    return NextResponse.json(item);
  } catch {
    return NextResponse.json(
      { message: 'Failed to read data' },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  context: any
) {
  try {
    const { id } = context.params as { id: string };
    const updatedItem: AcademicContent = await req.json();
    const data = await readData();
    const index = data.findIndex((item) => item.id === id);

    if (index === -1) {
      return NextResponse.json({ message: 'Not Found' }, { status: 404 });
    }

    data[index] = updatedItem;
    await writeData(data);

    return NextResponse.json(updatedItem);
  } catch {
    return NextResponse.json(
      { message: 'Failed to update data' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: Request,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  context: any
) {
  try {
    const { id } = context.params as { id: string };
    const data = await readData();
    const filteredData = data.filter((item) => item.id !== id);

    if (data.length === filteredData.length) {
      return NextResponse.json({ message: 'Not Found' }, { status: 404 });
    }

    await writeData(filteredData);

    return new NextResponse(null, { status: 204 }); // No Content
  } catch {
    return NextResponse.json(
      { message: 'Failed to delete data' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

type AppRouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(
  request: NextRequest,
  context: AppRouteContext
): Promise<NextResponse> {
  const { id } = await context.params;
  const placeholderPath = path.join(
    process.cwd(),
    'data',
    'student-images',
    'placeholderImage.png'
  );

  try {
    const imagePath = path.join(
      process.cwd(),
      'data',
      'student-images',
      `${id}.png`
    );

    // Check if the file exists
    await fs.access(imagePath);

    // If it exists, read and return it
    const imageBuffer = await fs.readFile(imagePath);
    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
      },
    });
  } catch {
    // If any error (e.g., file not found), return the placeholder
    try {
      const placeholderBuffer = await fs.readFile(placeholderPath);
      return new NextResponse(placeholderBuffer, {
        status: 200,
        headers: {
          'Content-Type': 'image/png',
        },
      });
    } catch {
      // If even the placeholder is missing
      return new NextResponse('Image not found', { status: 404 });
    }
  }
}

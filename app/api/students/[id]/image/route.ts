import { NextRequest, NextResponse } from 'next/server';
import { Student } from '@/lib/types';
import { checkPermission } from '@/lib/relationships';
import { currentUser } from '@clerk/nextjs/server';
import fs from 'fs';
import path from 'path';

// This should be a utility function in a real app
async function getStudents(): Promise<Student[]> {
  const filePath = path.join(process.cwd(), 'data', 'students.json');
  const jsonData = await fs.promises.readFile(filePath, 'utf-8');
  const studentsObject = JSON.parse(jsonData) as { [id: string]: Student };
  return Object.values(studentsObject);
}

export async function GET(
  request: NextRequest,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  context: any
) {
  const { id } = context.params as { id: string };

  // Handle placeholder image request separately
  if (id === 'placeholderDP.jpg') {
    const placeholderPath = path.join(
      process.cwd(),
      'data',
      'students',
      'images',
      'placeholderDP.jpg'
    );
    try {
      const imageBuffer = await fs.promises.readFile(placeholderPath);
      return new NextResponse(imageBuffer, {
        status: 200,
        headers: { 'Content-Type': 'image/jpeg' }, // Assuming it's a JPEG
      });
    } catch (error) {
      console.error('Error reading placeholder image file:', error);
      return new NextResponse('Placeholder image not found', { status: 404 });
    }
  }

  const user = await currentUser();
  if (!user) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const students = await getStudents();

  const targetUser = students.find((s) => s.id === id);
  if (!targetUser) {
    return new NextResponse('Student not found', { status: 404 });
  }

  // The viewer is the currently logged-in user
  const currentUserStudent = students.find((s) => s.clerkUserId === user.id);
  if (!currentUserStudent) {
    // This case should ideally not happen if the user is logged in
    return new NextResponse('Viewer not found', { status: 404 });
  }

  // Authorization check
  const hasAccess = checkPermission(
    targetUser.privacy_profileImage,
    currentUserStudent,
    targetUser
  );

  if (!hasAccess) {
    return new NextResponse('Forbidden', { status: 403 });
  }

  // If authorized, serve the image
  const imageName = targetUser.profileImage;
  if (!imageName) {
    return new NextResponse('Image not found for this user', { status: 404 });
  }

  const baseImageName = path.basename(imageName);

  // Construct the path to the image
  const imagePath = path.join(
    process.cwd(),
    'data',
    'students',
    'images',
    baseImageName
  );

  try {
    const imageBuffer = await fs.promises.readFile(imagePath);
    // Determine content type from file extension
    const extension = path.extname(imageName).toLowerCase();
    let contentType = 'image/jpeg'; // default
    if (extension === '.png') {
      contentType = 'image/png';
    } else if (extension === '.gif') {
      contentType = 'image/gif';
    } else if (extension === '.webp') {
      contentType = 'image/webp';
    }

    return new NextResponse(imageBuffer, {
      status: 200,
      headers: { 'Content-Type': contentType },
    });
  } catch (error) {
    console.error('Error reading image file:', error);
    return new NextResponse('Image not found', { status: 404 });
  }
}

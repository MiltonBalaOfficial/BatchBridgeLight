import { NextRequest, NextResponse } from 'next/server';
import { checkPermission } from '@/lib/relationships';
import {
  loadData,
  getStudentById,
  getStudentsAsArray,
} from '@/lib/db';
import { getCurrentUserStudent } from '@/lib/auth';
import fs from 'fs';
import path from 'path';

export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  await loadData();
  const { id } = context.params;

  // Handle placeholder image request
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
        headers: { 'Content-Type': 'image/jpeg' },
      });
    } catch (error) {
      console.error('Error reading placeholder image file:', error);
      return new NextResponse('Placeholder image not found', { status: 404 });
    }
  }

  const targetUser = getStudentById(id);
  if (!targetUser) {
    return new NextResponse('Student not found', { status: 404 });
  }

  const currentUserStudent = await getCurrentUserStudent();
  if (!currentUserStudent) {
    return new NextResponse('Unauthorized: Viewer profile not found', { status: 401 });
  }

  // Authorization check
  const hasAccess = checkPermission(
    targetUser.privacy_profileImage,
    currentUserStudent,
    targetUser
  );

  if (!hasAccess) {
    // Optionally, return a placeholder image for forbidden access
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
        status: 200, // Return 200 to avoid broken image icons client-side
        headers: { 'Content-Type': 'image/jpeg' },
      });
    } catch (error) {
      return new NextResponse('Forbidden', { status: 403 });
    }
  }

  const imageName = targetUser.profileImage;
  if (!imageName) {
    return new NextResponse('Image not found for this user', { status: 404 });
  }
  
  const baseImageName = path.basename(imageName);
  const imagePath = path.join(
    process.cwd(),
    'data',
    'students',
    'images',
    baseImageName
  );

  try {
    const imageBuffer = await fs.promises.readFile(imagePath);
    const extension = path.extname(imageName).toLowerCase();
    let contentType = 'image/jpeg';
    if (extension === '.png') contentType = 'image/png';
    else if (extension === '.gif') contentType = 'image/gif';
    else if (extension === '.webp') contentType = 'image/webp';
    
    return new NextResponse(imageBuffer, {
      status: 200,
      headers: { 'Content-Type': contentType },
    });
  } catch (error) {
    console.error(`Error reading image file: ${imagePath}`, error);
    return new NextResponse('Image file not found', { status: 404 });
  }
}

// G:/Nemoric.com/BatchBridgeLight/app/(protected)/explore-light/hooks/use-student-data.ts
'use client';

import { useState, useEffect } from 'react';
import { College, Student } from '@/lib/types';

const COLLEGE_ID = 'b16b7458-1d89-4143-9b3c-7d6d7a6d1859'; // COMJNMH

async function fetchStudents(collegeId: string): Promise<Student[]> {
  try {
    const response = await fetch(`/api/students?collegeId=${collegeId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch students: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching students:', error);
    return [];
  }
}

async function fetchCurrentUser(): Promise<Student | null> {
  try {
    const response = await fetch('/api/user');
    if (!response.ok) {
      // It's possible the user doesn't have a student profile yet
      if (response.status === 404) {
        return null;
      }
      throw new Error(`Failed to fetch current user: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching current user:', error);
    return null;
  }
}

async function fetchBatches(collegeId: string): Promise<{ value: string; label: string }[]> {
    try {
        const response = await fetch(`/api/batches?collegeId=${collegeId}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch batches: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching batches:", error);
        return [];
    }
}

async function fetchColleges(): Promise<College[]> {
    try {
        const response = await fetch('/api/colleges');
        if (!response.ok) {
            throw new Error(`Failed to fetch colleges: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching colleges:", error);
        return [];
    }
}


export function useStudentData() {
  const [students, setStudents] = useState<Student[]>([]);
  const [currentUser, setCurrentUser] = useState<Student | null>(null);
  const [batches, setBatches] = useState<{ value: string; label: string }[]>([]);
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError(null);

      try {
        const [studentData, currentUserData, batchData, collegeData] = await Promise.all([
          fetchStudents(COLLEGE_ID),
          fetchCurrentUser(),
          fetchBatches(COLLEGE_ID),
          fetchColleges(),
        ]);

        setStudents(studentData);
        setCurrentUser(currentUserData);
        setBatches(batchData);
        setColleges(collegeData);

      } catch (err) {
        setError('An unexpected error occurred while loading data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  return { students, currentUser, batches, colleges, loading, error, COLLEGE_ID };
}

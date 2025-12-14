import { useState, useEffect, useCallback } from 'react';
import { Student, UserPreferences, College } from '@/lib/types';
import { useAuth } from '@clerk/nextjs';
import { calculateTotalScore, stableHash } from '@/lib/sorting';

export interface Batch {
  value: string;
  label: string;
}

export function useExplore() {
  const { isSignedIn } = useAuth();

  // Raw Data State
  const [currentUser, setCurrentUser] = useState<Student | null>(null);
  const [colleges, setColleges] = useState<College[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [students, setStudents] = useState<Student[]>([]); // Raw students from API
  const [userPreferences, setUserPreferences] =
    useState<UserPreferences | null>(null);

  // Filter & UI State
  const [selectedCollege, setSelectedCollege] = useState<string | null>('all');
  const [selectedBatch, setSelectedBatch] = useState<string | null>('all');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortedStudents, setSortedStudents] = useState<Student[]>([]); // Final list for UI

  // Loading State
  const [loadingColleges, setLoadingColleges] = useState(true);
  const [loadingBatches, setLoadingBatches] = useState(false);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [isInitialDataLoaded, setIsInitialDataLoaded] = useState(false);

  // Effect for Initial Data Load (User, Preferences, and user's default college/batch)
  useEffect(() => {
    if (!isSignedIn) return;

    const fetchInitialData = async () => {
      setLoadingUser(true);
      setLoadingBatches(true);
      try {
        const [userResponse, preferencesResponse] = await Promise.all([
          fetch('/api/user'),
          fetch('/api/user/preferences'), // Fetching from the new API endpoint
        ]);

        const user = await userResponse.json();
        const preferences = await preferencesResponse.json();

        if (userResponse.ok) setCurrentUser(user);
        else console.error('Failed to fetch user profile:', user);

        if (preferencesResponse.ok) setUserPreferences(preferences);
        else console.error('Failed to fetch user preferences:', preferences);

        if (user?.collegeId) {
          setSelectedCollege(user.collegeId);
          const batchesResponse = await fetch(
            `/api/batches?collegeId=${user.collegeId}`
          );
          const batchesData = await batchesResponse.json();
          setBatches(batchesData);

          if (user.admissionYear) {
            const admissionYearStr = String(user.admissionYear);
            if (batchesData.some((b: Batch) => b.value === admissionYearStr)) {
              setSelectedBatch(admissionYearStr);
            } else {
              setSelectedBatch('all');
            }
          } else {
            setSelectedBatch('all');
          }
        } else {
          setSelectedCollege('all');
          setSelectedBatch('all');
          setBatches([]);
        }
      } catch (error) {
        console.error('Failed to fetch initial data', error);
        setBatches([]);
        setSelectedCollege('all');
        setSelectedBatch('all');
      } finally {
        setLoadingUser(false);
        setLoadingBatches(false);
        setIsInitialDataLoaded(true);
      }
    };

    fetchInitialData();
  }, [isSignedIn]);

  // Effect to fetch all colleges (runs once)
  useEffect(() => {
    if (!isSignedIn) return;
    const fetchColleges = async () => {
      try {
        setLoadingColleges(true);
        const response = await fetch('/api/colleges');
        setColleges(await response.json());
      } catch (error) {
        console.error('Failed to fetch colleges', error);
      } finally {
        setLoadingColleges(false);
      }
    };
    fetchColleges();
  }, [isSignedIn]);

  // Effect to fetch batches when user manually changes college
  useEffect(() => {
    if (!isInitialDataLoaded || !selectedCollege) {
      setBatches([]);
      return;
    }
    const fetchBatches = async () => {
      try {
        setLoadingBatches(true);
        const url =
          selectedCollege === 'all'
            ? '/api/batches'
            : `/api/batches?collegeId=${selectedCollege}`;
        const response = await fetch(url);
        setBatches(await response.json());
      } catch (error) {
        console.error('Failed to fetch batches', error);
      } finally {
        setLoadingBatches(false);
      }
    };
    fetchBatches();
  }, [selectedCollege, isInitialDataLoaded]);

  // Effect to fetch students when filters change
  useEffect(() => {
    if (!isSignedIn || !isInitialDataLoaded) return;
    const fetchStudents = async () => {
      setLoadingStudents(true);
      try {
        const params = new URLSearchParams();
        if (selectedCollege && selectedCollege !== 'all')
          params.append('collegeId', selectedCollege);
        if (selectedBatch && selectedBatch !== 'all')
          params.append('batch', selectedBatch);

        const url = `/api/students?${params.toString()}`;
        const response = await fetch(url);
        setStudents(await response.json());
      } catch (error) {
        console.error('Failed to fetch students:', error);
        setStudents([]);
      } finally {
        setLoadingStudents(false);
      }
    };

    fetchStudents();
  }, [selectedCollege, selectedBatch, isSignedIn, isInitialDataLoaded]);

  // NEW: Effect to process (filter/sort) students when raw data or preferences change
  useEffect(() => {
    let processedStudents = [...students];

    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      processedStudents = processedStudents.filter((student) => {
        const fullName =
          `${student.name_first} ${student.name_last}`.toLowerCase();
        const collegeName =
          colleges
            .find((c) => c.id === student.collegeId)
            ?.name?.toLowerCase() || '';
        return (
          fullName.includes(lowerCaseSearchTerm) ||
          collegeName.includes(lowerCaseSearchTerm) ||
          student.admissionYear.toString().includes(lowerCaseSearchTerm) ||
          student.collegeBatch.toLowerCase().includes(lowerCaseSearchTerm)
        );
      });
    }

    if (
      userPreferences &&
      processedStudents.length > 0 &&
      colleges.length > 0
    ) {
      const studentsWithScores = processedStudents.map((student) => ({
        student,
        score: calculateTotalScore(student, userPreferences, colleges),
      }));

      const newSortedStudents = studentsWithScores
        .sort((a, b) => {
          if (b.score !== a.score) return b.score - a.score;
          const collegeA = colleges.find((c) => c.id === a.student.collegeId);
          const collegeB = colleges.find((c) => c.id === b.student.collegeId);
          const sameStateA =
            collegeA?.state === userPreferences.defaultState ? 1 : 0;
          const sameStateB =
            collegeB?.state === userPreferences.defaultState ? 1 : 0;
          if (sameStateA !== sameStateB) return sameStateB - sameStateA;
          return stableHash(a.student.id) - stableHash(b.student.id);
        })
        .map((item) => item.student);

      setSortedStudents(newSortedStudents);
    } else {
      setSortedStudents(processedStudents);
    }
  }, [students, userPreferences, colleges, searchTerm]);

  // Handlers
  const handleCollegeChange = useCallback((collegeId: string) => {
    setSelectedCollege(collegeId);
    setSelectedBatch('all');
  }, []);

  const handleBatchChange = useCallback((batch: string | null) => {
    setSelectedBatch(batch);
  }, []);

  const handleStudentSelect = useCallback((student: Student) => {
    setSelectedStudent(student);
  }, []);

  const handleBackToGrid = useCallback(() => {
    setSelectedStudent(null);
  }, []);

  return {
    currentUser,
    loadingUser,
    colleges,
    loadingColleges,
    selectedCollege,
    handleCollegeChange,
    batches,
    loadingBatches,
    selectedBatch,
    handleBatchChange,
    sortedStudents, // Replaces students and studentsById
    loadingStudents,
    selectedStudent,
    handleStudentSelect,
    handleBackToGrid,
    searchTerm,
    setSearchTerm, // Expose search term setter
  };
}

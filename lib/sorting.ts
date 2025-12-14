// lib/sorting.ts
import { Student, UserPreferences, College } from '@/lib/types';

// Helper function to generate a stable hash for consistent random fallback
export const stableHash = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash);
};

// Function to calculate the total score for a student
export const calculateTotalScore = (
  student: Student,
  preferences: UserPreferences,
  allColleges: College[]
): number => {
  const {
    collegeWisePreferences,
    interestedColleges,
    interestedStudents,
    defaultState,
    preferenceWeights,
  } = preferences;

  const {
    collegeWeight: defaultCollegeWeight,
    studentWeight: defaultStudentWeight,
    mutualBoost, // Currently not implemented, defaults to 0
    stateBonus,
    popularityWeight,
    activityWeight, // Currently not implemented, defaults to 0
  } = preferenceWeights;

  let effectiveCollegeWeight = defaultCollegeWeight;
  let effectiveStudentWeight = defaultStudentWeight;

  if (!collegeWisePreferences) {
    effectiveCollegeWeight = defaultStudentWeight;
    effectiveStudentWeight = defaultCollegeWeight;
  }

  const collegePrefScore = interestedColleges[student.collegeId] || 0;
  const studentPrefScore = interestedStudents[student.id] || 0;

  const studentCollege = allColleges.find((c) => c.id === student.collegeId);
  const sameStateFlag =
    studentCollege && studentCollege.state === defaultState ? 1 : 0;

  const mutualInterestFlag = 0;
  const activityScore = 0;

  const popularity = (student.popularity || 0) / 100;

  const totalScore =
    effectiveCollegeWeight * collegePrefScore +
    effectiveStudentWeight * studentPrefScore +
    mutualBoost * mutualInterestFlag +
    stateBonus * sameStateFlag +
    popularityWeight * popularity +
    activityWeight * activityScore;

  return totalScore;
};

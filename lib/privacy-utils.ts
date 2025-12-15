import { Student, PrivacyObject } from '@/lib/types';

/**
 * Checks if the currentUser has permission to view a specific piece of information
 * on the targetStudent based on a detailed PrivacyObject.
 */
export function checkPermission(
  privacy: PrivacyObject | undefined,
  currentUser: Student | null,
  targetStudent: Student
): boolean {
  // If no privacy object is defined, assume public
  if (!privacy || privacy.level === 'public') {
    return true;
  }

  // If the target student is the current user, they can always see their own data
  if (currentUser && targetStudent.Id === currentUser.Id) {
    return true;
  }

  // If currentUser is null, and privacy is not public, then no permission
  if (!currentUser) {
    return false;
  }

  // Helper functions for relationship checks
  const canCheckSeniority =
    currentUser.admissionYear !== undefined &&
    targetStudent.admissionYear !== undefined;

  const isBatchmate =
    canCheckSeniority &&
    targetStudent.admissionYear === currentUser.admissionYear;
  const isTargetSenior =
    canCheckSeniority &&
    targetStudent.admissionYear! < currentUser.admissionYear!;
  const isTargetJunior =
    canCheckSeniority &&
    targetStudent.admissionYear! > currentUser.admissionYear!;

  // Check privacy level
  switch (privacy.level) {
    case 'onlyMe':
      return false; // Already handled for self above, so truly only me
    case 'allUsers':
    case 'collegeBuddy':
      return true;

    case 'batchmate':
      return isBatchmate;

    case 'senior': // Target is a senior
      return isTargetSenior;

    case 'junior': // Target is a junior
      return isTargetJunior;

    case 'batchmateandjunior':
      return isBatchmate || isTargetJunior;

    case 'batchmateandsenior':
      return isBatchmate || isTargetSenior;

    default:
      // Default to true for any other unhandled but non-restrictive levels.
      // E.g. 'public' which is already handled, but as a safeguard.
      return true;
  }
}

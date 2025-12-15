import { Student, PrivacyObject } from '@/lib/types'; // Removed unused PrivacyLevel, SeniorityFilter, GenderFilter

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
  const isBatchMate =
    currentUser.admissionYear !== undefined &&
    targetStudent.admissionYear !== undefined &&
    targetStudent.admissionYear === currentUser.admissionYear;

  // const isCollegeBuddy = true; // Removed unused variable

  // Check privacy level
  switch (privacy.level) {
    case 'onlyMe':
      return false; // Already handled for self above, so truly only me
    case 'allUsers':
    case 'collegeBuddy':
      // Handled by default through current user check; no further restriction at this level for now
      break;
    case 'collegeBatchmate':
    case 'yearMate':
      if (!isBatchMate) {
        return false;
      }
      break;
    case 'collegeAlumni':
      // Simplified: current user must be an alumnus (passedOut) and from the same college
      // or target student is alumnus and current user is also alumnus
      // This logic needs refinement based on actual relationship definition
      if (!currentUser.passedOut || !targetStudent.passedOut) {
        // Both need to have passed out for alumnus relation
        return false;
      }
      // If current user is senior to target student (i.e., currentUser admitted earlier)
      if (
        currentUser.admissionYear !== undefined &&
        targetStudent.admissionYear !== undefined &&
        targetStudent.admissionYear > currentUser.admissionYear
      ) {
        break; // Current user is an alumnus relative to target
      }
      return false; // Not a college alumnus based on simplified logic
    case 'friends': // Not implemented in current data model
    case 'closedFriends': // Not implemented in current data model
    case 'hostelBuddy': // Not implemented in current data model
    case 'fromMyState': // Not implemented in current data model
    case 'verifiedUsers': // Not implemented in current data model
    case 'admin': // Not implemented in current data model
      return false; // Unknown or unsupported privacy level
    default:
      // Default case for PrivacyLevel values like 'public' that are handled earlier or no specific restriction
      break;
  }

  // Check seniority filter (Applies *after* privacy level)
  if (privacy.seniority) {
    if (
      currentUser.admissionYear === undefined ||
      targetStudent.admissionYear === undefined
    ) {
      return false; // Cannot determine seniority without admission years
    }
    switch (privacy.seniority) {
      case 'batchmatesOnly':
        if (targetStudent.admissionYear !== currentUser.admissionYear)
          return false;
        break;
      case 'seniorsOnly':
        if (targetStudent.admissionYear >= currentUser.admissionYear)
          return false;
        break;
      case 'juniorsOnly':
        if (targetStudent.admissionYear <= currentUser.admissionYear)
          return false;
        break;
      case 'notSeniors':
        if (targetStudent.admissionYear < currentUser.admissionYear)
          return false;
        break;
      case 'notJuniors':
        if (targetStudent.admissionYear > currentUser.admissionYear)
          return false;
        break;
      case 'all':
      default:
        break; // No specific seniority filter
    }
  }

  // Check gender filter (Applies *after* privacy level and seniority)
  if (privacy.gender) {
    if (
      currentUser.gender === undefined ||
      targetStudent.gender === undefined
    ) {
      return false; // Cannot determine gender match without gender info
    }
    switch (privacy.gender) {
      case 'sameGender':
        if (targetStudent.gender !== currentUser.gender) return false;
        break;
      case 'oppositeGender':
        if (targetStudent.gender === currentUser.gender) return false;
        break;
      case 'all':
      default:
        break; // No specific gender filter
    }
  }

  return true; // All checks passed
}

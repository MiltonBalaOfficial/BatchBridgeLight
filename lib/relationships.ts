import { Student, PrivacyObject, PrivacyLevel } from '@/lib/types';

/**
 * Calculates all applicable relationship levels between two students.
 * @param currentUser The user viewing the profile.
 * @param targetUser The user whose profile is being viewed.
 * @returns A Set containing all applicable PrivacyLevel relationships.
 */
export function getRelationships(
  currentUser: Student | null,
  targetUser: Student
): Set<PrivacyLevel> {
  const relationships = new Set<PrivacyLevel>();
  relationships.add('public'); // Everyone has public access

  if (!currentUser) {
    return relationships;
  }

  // Core relationships
  relationships.add('allUsers');
  if (currentUser.id === targetUser.id) {
    relationships.add('onlyMe');
  }
  if (currentUser.isVerified) {
    relationships.add('verifiedUsers');
  }
  if (currentUser.role === 'admin') {
    relationships.add('admin');
  }

  // College and year relationships
  if (currentUser.collegeId === targetUser.collegeId) {
    relationships.add('collegeBuddy');
    if (currentUser.admissionYear === targetUser.admissionYear) {
      relationships.add('collegeBatchmate');
    }
  }
  if (currentUser.admissionYear === targetUser.admissionYear) {
    relationships.add('yearMate');
  }

  // Location relationships
  if (
    currentUser.permanent_state &&
    currentUser.permanent_state === targetUser.permanent_state
  ) {
    relationships.add('fromMyState');
  }

  // Alumni relationships
  if (targetUser.passedOut) {
    relationships.add('alumni');
    if (
      currentUser.collegeId === targetUser.collegeId &&
      currentUser.passedOut
    ) {
      relationships.add('collegeAlumni');
    }
  }

  // Hostel relationships (simplified example)
  // A real implementation would need to check for overlapping date ranges
  const targetHostels = new Set(
    targetUser.hostelHistory?.map((h) => h.building)
  );
  if (targetUser.hostelHistory && currentUser.hostelHistory) {
    for (const history of currentUser.hostelHistory) {
      if (history.building && targetHostels.has(history.building)) {
        relationships.add('hostelBuddy');
        break;
      }
    }
  }

  // Friend relationships would be checked here based on a friends list
  // relationships.add('friends');
  // relationships.add('closedFriends');

  return relationships;
}

/**
 * Checks if a user has permission to view a piece of information based on a PrivacyObject.
 * @param privacy The PrivacyObject rule for the piece of information.
 * @param currentUser The user viewing the profile.
 * @param targetUser The user whose profile is being viewed.
 * @returns `true` if permission is granted, `false` otherwise.
 */
export function checkPermission(
  privacy: PrivacyObject,
  currentUser: Student | null,
  targetUser: Student
): boolean {
  // 1. Handle the simplest case
  if (privacy.level === 'public') {
    return true;
  }

  // If not public, a logged-in user is required
  if (!currentUser) {
    return false;
  }

  // 2. Check the relationship level
  const relationships = getRelationships(currentUser, targetUser);
  if (!relationships.has(privacy.level)) {
    return false;
  }

  // 3. Apply the seniority filter
  if (privacy.seniority !== 'all') {
    const seniorOk =
      privacy.seniority === 'seniorsOnly' &&
      currentUser.admissionYear < targetUser.admissionYear;
    const juniorOk =
      privacy.seniority === 'juniorsOnly' &&
      currentUser.admissionYear > targetUser.admissionYear;
    const batchmateOk =
      privacy.seniority === 'batchmatesOnly' &&
      currentUser.admissionYear === targetUser.admissionYear;
    const notSeniorOk =
      privacy.seniority === 'notSeniors' &&
      currentUser.admissionYear >= targetUser.admissionYear;
    const notJuniorOk =
      privacy.seniority === 'notJuniors' &&
      currentUser.admissionYear <= targetUser.admissionYear;

    if (
      !seniorOk &&
      !juniorOk &&
      !batchmateOk &&
      !notSeniorOk &&
      !notJuniorOk
    ) {
      return false;
    }
  }

  // 4. Apply the gender filter
  if (privacy.gender !== 'all') {
    const viewerGender = currentUser.gender;
    const ownerGender = targetUser.gender;

    // If gender is unknown for either party, cannot apply filter
    if (
      !viewerGender ||
      !ownerGender ||
      viewerGender === 'preferNotToSay' ||
      ownerGender === 'preferNotToSay'
    ) {
      return false;
    }

    const sameGenderOk =
      privacy.gender === 'sameGender' && viewerGender === ownerGender;

    // This simple logic works for binary genders. A more robust solution
    // would be needed for 'other' or more complex gender identities.
    const oppositeGenderOk =
      privacy.gender === 'oppositeGender' && viewerGender !== ownerGender;

    if (!sameGenderOk && !oppositeGenderOk) {
      return false;
    }
  }

  // 5. If all checks pass, permission is granted
  return true;
}

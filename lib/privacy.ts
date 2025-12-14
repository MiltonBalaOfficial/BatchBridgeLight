import { Student } from '@/lib/types';
import { checkPermission } from '@/lib/relationships';

// A mapping from a privacy setting key to the actual data key it controls.
const privacyKeyMapping: { [key: string]: keyof Student } = {
  privacy_profile: 'bio', // Example, needs to be comprehensive
  privacy_contact_email: 'contact_email',
  privacy_contact_alt_email: 'contact_alt_email',
  privacy_contact_phone: 'contact_phone',
  privacy_contact_alt_phone: 'contact_alt_phone',
  privacy_contact_whatsapp: 'contact_whatsapp',
  privacy_contact_telegram: 'contact_telegram',
  privacy_socials: 'socials',
  privacy_permanentAddress: 'permanent_houseNo', // This is just one field, address is complex
  privacy_currentAddress: 'current_houseNo', // Complex field
  privacy_profileImage: 'profileImage',
  privacy_birth_day: 'birth_day',
  privacy_birth_month: 'birth_month',
  privacy_birth_year: 'birth_year',
  privacy_bio: 'bio',
  privacy_hostelHistory: 'hostelHistory',
  privacy_hostelMemories: 'hostelMemories',
  privacy_professionalInfo: 'professionalInfo',
};

// Fields that should be completely removed from the client-side object
const privateFields: (keyof Student)[] = [
  'isVerified',
  'accountStatus',
  'deletedAt',
  'role',
  'permanent_street',
  'permanent_area',
  'permanent_landmark',
  'permanent_post_office',
  'permanent_district',
  'permanent_state',
  'permanent_country',
  'permanent_pincode',
  'current_street',
  'current_area',
  'current_landmark',
  'current_post_office',
  'current_district',
  'current_state',
  'current_country',
  'current_pincode',
];

/**
 * Filters a student object, removing fields that the current user does not have permission to see.
 * @param student The full student object to filter.
 * @param currentUser The user who is viewing the profile. Can be null for public views.
 * @returns A new, filtered student object safe to send to the client.
 */
export function filterStudentForClient(
  student: Student,
  currentUser: Student | null
): Partial<Student> {
  const filteredStudent: Partial<Student> = { ...student };

  // 1. Remove fields that are never sent to the client
  for (const field of privateFields) {
    delete filteredStudent[field];
  }

  // 2. Process fields controlled by privacy settings
  for (const key in student) {
    if (key.startsWith('privacy_')) {
      const privacySettingKey = key as keyof typeof privacyKeyMapping;
      const dataKey = privacyKeyMapping[privacySettingKey];

      // @ts-expect-error - We are dealing with dynamic keys
      const privacyObject = student[privacySettingKey];

      if (dataKey && privacyObject) {
        const hasAccess = checkPermission(privacyObject, currentUser, student);
        if (!hasAccess) {
          // If the user doesn't have access, remove the data field
          delete filteredStudent[dataKey];
        }
      }

      // Always remove the privacy setting itself
      // delete (filteredStudent as any)[privacySettingKey];
    }
  }

  // Special handling for complex address fields
  if (
    !checkPermission(student.privacy_permanentAddress, currentUser, student)
  ) {
    delete filteredStudent.permanent_houseNo;
    // all other permanent address fields are already removed by privateFields
  }
  if (!checkPermission(student.privacy_currentAddress, currentUser, student)) {
    delete filteredStudent.current_houseNo;
    // all other current address fields are already removed by privateFields
  }

  return filteredStudent;
}

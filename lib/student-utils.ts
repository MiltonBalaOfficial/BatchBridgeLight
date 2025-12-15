import {
  Student,
  RawStudent,
  PrivacyObject,
  PrivacyLevel,
} from '@/lib/types';

// Helper function to transform string privacy levels to PrivacyObject
const transformPrivacyStringToObject = (
  privacyString: string | undefined
): PrivacyObject | undefined => {
  if (!privacyString) return undefined;
  // Cast to PrivacyLevel, assuming the strings in JSON match PrivacyLevel types
  return { level: privacyString as PrivacyLevel };
};

export const processRawStudent = (raw: RawStudent): Student => {
  const validGenders = ['male', 'female', 'other'];
  const gender: 'male' | 'female' | 'other' | undefined =
    raw.gender && validGenders.includes(raw.gender)
      ? (raw.gender as 'male' | 'female' | 'other')
      : undefined;

  return {
    ...raw,
    gender,
    privacy_contact_email: transformPrivacyStringToObject(
      raw.privacy_contact_email
    ),
    privacy_contact_phone: transformPrivacyStringToObject(
      raw.privacy_contact_Phone
    ),
    privacy_contact_whatsapp: transformPrivacyStringToObject(
      raw.Privacy_contact_Whatsapp
    ),
    privacy_contact_telegram: transformPrivacyStringToObject(
      raw.privacy_contact_telegram
    ),
    privacy_address: transformPrivacyStringToObject(raw.privacy_address),
    privacy_birth_day: transformPrivacyStringToObject(raw.privacy_birth_day),
    privacy_birth_month: transformPrivacyStringToObject(
      raw.privacy_birth_month
    ),
    privacy_profile_image: transformPrivacyStringToObject(
      raw.privacy_profile_image
    ),
    privacy_profile: transformPrivacyStringToObject(raw.profilePrivacy),
    privacy_FatherName: transformPrivacyStringToObject(
      raw.privacy_FatherName
    ),
    privacy_roll_no: transformPrivacyStringToObject(raw.privacy_roll_no),
    privacy_currentHostelRoom: transformPrivacyStringToObject(
      raw.privacy_currentHostelRoom
    ),
    contact_phone: raw.contact_Phone,
    contact_whatsapp: raw.contact_Whatsapp,
    name_first: raw.name_first || raw.fullName.split(' ')[0],
        name_last: raw.name_last || raw.fullName.split(' ').slice(1).join(' '),
      };
    };
    
    export const filterStudents = (
      students: Student[],
      currentUser: Student,
      batch: string | null
    ): Student[] => {
      if (batch === 'all') {
        return students;
      }
      return students.filter((s) => s.admissionYear?.toString() === batch);
    };
    
// lib/types.ts

export type PrivacyLevel =
  | 'public'
  | 'onlyMe'
  | 'allUsers'
  | 'friends'
  | 'closedFriends'
  | 'collegeBuddy'
  | 'collegeBatchmate'
  | 'collegeAlumni'
  | 'hostelBuddy'
  | 'fromMyState'
  | 'yearMate'
  | 'alumni'
  | 'verifiedUsers'
  | 'admin';

export type SeniorityFilter =
  | 'all'
  | 'batchmatesOnly'
  | 'seniorsOnly'
  | 'juniorsOnly'
  | 'notSeniors'
  | 'notJuniors';

export type GenderFilter = 'all' | 'sameGender' | 'oppositeGender';

export interface PrivacyObject {
  level: PrivacyLevel;
  seniority?: SeniorityFilter;
  gender?: GenderFilter;
}

export interface SocialLink {
  type: string;
  url: string;
}

export interface Degree {
  degreeName: string;
  institution: string;
  year?: number;
}

export interface WorkExperienceEntry {
  designation: string;
  workplace: string;
  from: string;
  to?: string;
}

export interface ProfessionalInfo {
  ProfessionalPreNominal?: string;
  speciality?: string;
  degrees?: Degree[];
  workExperience?: WorkExperienceEntry[];
}

export interface HostelHistoryEntry {
  type: 'hosteller' | 'dayScholar';
  building?: string;
  room?: string;
  bed?: string;
  entry: string;
  exit?: string;
}

export interface HostelMemories {
  images: string[];
  videos: string[];
}

export interface Student {
  Id: string;
  fullName: string;
  FatherName?: string;
  gender?: 'male' | 'female' | 'other';
  admissionYear?: number;
  roll_no?: string;
  passedOut?: number | null;
  contact_email?: string;
  contact_phone?: string;
  contact_whatsapp?: string;
  contact_telegram?: string;
  contact_alt_email?: string;
  contact_alt_phone?: string;
  birth_day?: number;
  birth_month?: number;
  birth_year?: number;
  socials?: SocialLink[];
  fullAddress?: string;
  profileImage?: string;
  bio?: string;
  collegeId?: string;
  name_first?: string; // Derived or undefined
  name_last?: string; // Derived or undefined

  collegeBatch?: string;
  degree?: string;

  current_houseNo?: string;
  current_street?: string;
  current_area?: string;
  current_landmark?: string;
  current_post_office?: string;
  current_district?: string;
  current_state?: string;
  current_country?: string;
  current_pincode?: string;

  permanent_houseNo?: string;
  permanent_street?: string;
  permanent_area?: string;
  permanent_landmark?: string;
  permanent_post_office?: string;
  permanent_district?: string;
  permanent_state?: string;
  permanent_country?: string;
  permanent_pincode?: string;

  professionalInfo?: ProfessionalInfo;
  hostelHistory?: HostelHistoryEntry[];
  hostelMemories?: HostelMemories;

  // All privacy fields now use PrivacyObject
  privacy_contact_email?: PrivacyObject;
  privacy_contact_phone?: PrivacyObject;
  privacy_contact_whatsapp?: PrivacyObject;
  privacy_contact_telegram?: PrivacyObject;
  privacy_address?: PrivacyObject;
  privacy_birth_day?: PrivacyObject;
  privacy_birth_month?: PrivacyObject;
  privacy_profileImage?: PrivacyObject;
  privacy_bio?: PrivacyObject;
  privacy_professionalInfo?: PrivacyObject;
  privacy_socials?: PrivacyObject;
  privacy_currentAddress?: PrivacyObject;
  privacy_permanentAddress?: PrivacyObject;
  privacy_birth_year?: PrivacyObject;
  privacy_hostelHistory?: PrivacyObject;
  privacy_hostelMemories?: PrivacyObject;
  privacy_profile?: PrivacyObject;
  privacy_contact_alt_email?: PrivacyObject;
  privacy_contact_alt_phone?: PrivacyObject;
}

export interface College {
  id: string;
  name: string;
  short_name?: string;
  // Add other college properties as needed
}

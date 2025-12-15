// lib/types.ts

// Based on the values in studentLight.json
export type PrivacyLevel =
  | 'public' // A sensible default
  | 'allUsers'
  | 'collegeBuddy'
  | 'batchmate'
  | 'onlyMe'
  | 'batchmateandjunior'
  | 'batchmateandsenior'
  | 'senior'
  | 'junior';

export interface PrivacyObject {
  level: PrivacyLevel;
}

export interface SocialLink {
  type: string;
  url: string;
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
  birth_day?: number;
  birth_month?: number;
  socials?: SocialLink[];
  fullAddress?: string;
  profileImage?: string;
  bio?: string;
  currentHostelRoom?: string;
  hostelRoomUpdatedAt?: string;

  // Derived fields
  name_first?: string;
  name_last?: string;

  // Privacy fields as objects
  privacy_profile?: PrivacyObject;
  privacy_contact_email?: PrivacyObject;
  privacy_contact_phone?: PrivacyObject;
  privacy_contact_whatsapp?: PrivacyObject;
  privacy_contact_telegram?: PrivacyObject;
  privacy_address?: PrivacyObject;
  privacy_birth_day?: PrivacyObject;
  privacy_birth_month?: PrivacyObject;
  privacy_profile_image?: PrivacyObject;
  privacy_currentHostelRoom?: PrivacyObject;
  privacy_roll_no?: PrivacyObject;
  privacy_FatherName?: PrivacyObject;
}

export interface RawStudent {
  Id: string;
  fullName: string;
  FatherName?: string;
  gender?: string;
  admissionYear?: number;
  roll_no?: string;
  passedOut?: number | null;
  contact_email?: string;
  contact_Phone?: string; // Note the casing in JSON
  contact_Whatsapp?: string;
  contact_telegram?: string;
  birth_day?: number;
  birth_month?: number;
  socials?: SocialLink[];
  fullAddress?: string;
  profileImage?: string;
  bio?: string;
  currentHostelRoom?: string;
  hostelRoomUpdatedAt?: string;

  // Privacy fields as strings from JSON
  profilePrivacy?: string;
  privacy_contact_email?: string;
  privacy_contact_Phone?: string; // Note the casing in JSON
  Privacy_contact_Whatsapp?: string; // Note the casing in JSON
  privacy_contact_telegram?: string;
  privacy_address?: string;
  privacy_birth_day?: string;
  privacy_birth_month?: string;
  privacy_profile_image?: string;
  privacy_currentHostelRoom?: string;
  privacy_roll_no?: string;
  privacy_FatherName?: string;

  // Derived fields are not in raw data
  name_first?: string;
  name_last?: string;
}



export interface TeamMember {
  id: string;
  name: string;
  role: string;
  description?: string;
  image: string;
  socials?: SocialLink[];
}

export interface Patron {
  id: string;
  name: string;
  role: string;
  description?: string;
  image: string;
  socials?: SocialLink[];
}
// lib/types.ts

export interface College {
  id: string;
  name: string;
  short_name: string;
  location: string;
  state: string;
  established_year: number;
  type: string;
  website: string;
  updated_at: string;
}

export type AcademicNode = {
  id: string;
  parentId: string | null;
  type: 'degree' | 'course' | 'subject';
  name: string;
  academicSystem?: 'year' | 'semester';
  course?: string | null;
  scopeId: string;
  orderIndex: number;
  collapsed: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  synced: boolean;
};

export type AcademicStructure = AcademicNode[];

export interface Batch {
  value: string;
  label: string;
}

// Inferred Types from components/admin/student-form.tsx and other usages

export type PrivacyLevel =
  | 'public'
  | 'onlyMe'
  | 'allUsers'
  | 'all' // Added from usage
  | 'friends'
  | 'closedFriends'
  | 'collegeBuddy'
  | 'hostelBuddy'
  | 'fromMyState'
  | 'yearMate'
  | 'alumni'
  | 'verifiedUsers'
  | 'admin'
  | 'collegeBatchmate' // Added from error analysis
  | 'collegeAlumni'; // Added from error analysis

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
  seniority: SeniorityFilter;
  gender: GenderFilter;
}

export interface SocialLink {
  type:
    | 'instagram'
    | 'facebook'
    | 'twitter'
    | 'linkedin'
    | 'youtube'
    | 'website'
    | 'discord'
    | 'github';
  url: string;
}

export interface HostelHistoryEntry {
  type: 'hosteller' | 'dayScholar';
  building: string;
  room: string;
  bed: string;
  entry: string; // ISO date string or similar format
  exit: string; // ISO date string or similar format
}

export interface HostelMemories {
  images: string[]; // Array of URLs
  videos: string[]; // Array of URLs
}

export interface DegreeEntry {
  degreeName: string;
  institution: string;
  year?: number;
}

export interface WorkExperienceEntry {
  designation: string;
  workplace: string;
  from?: string; // ISO date string
  to?: string; // ISO date string or 'Present'
}

export interface ProfessionalInfo {
  ProfessionalPreNominal?: string;
  speciality?: string;
  degrees: DegreeEntry[];
  workExperience: WorkExperienceEntry[];
}

export interface Student {
  id: string;
  clerkUserId?: string;
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
  slug?: string;
  role?: string;
  accountStatus?: string;
  deletedAt?: string | null; // Changed to allow null

  // Basic Information
  name_first: string;
  name_middle?: string;
  name_last: string;
  gender?: 'male' | 'female' | 'other' | 'preferNotToSay';
  collegeId: string; // Matches College.id
  degree: 'MBBS' | 'MD' | 'MS' | 'BDS' | 'MDS' | 'BAMS' | 'BHMS';
  admissionYear: number;
  collegeBatch: string; // e.g., "12th Batch"
  academicSystem?: 'year' | 'semester';
  currentCourse?: string;
  passedOut?: number;

  // Contact Information
  contact_email: string;
  contact_phone?: string;
  contact_alt_email?: string;
  contact_alt_phone?: string;
  contact_whatsapp?: string;
  contact_telegram?: string;

  // Socials
  socials: SocialLink[];

  // Address
  permanent_houseNo?: string;
  permanent_street?: string;
  permanent_area?: string;
  permanent_landmark?: string;
  permanent_post_office?: string;
  permanent_district?: string;
  permanent_state?: string;
  permanent_country?: string;
  permanent_pincode?: string;

  current_houseNo?: string;
  current_street?: string;
  current_area?: string;
  current_landmark?: string;
  current_post_office?: string;
  current_district?: string;
  current_state?: string;
  current_country?: string;
  current_pincode?: string;

  // Profile Details
  profileImage?: string; // URL
  birth_day?: number;
  birth_month?: number;
  birth_year?: number;
  bio?: string;

  // Hostel Information
  hostelHistory: HostelHistoryEntry[];
  hostelMemories: HostelMemories;

  // Professional Information
  professionalInfo?: ProfessionalInfo;

  // Additional properties found from errors
  popularity?: number; // Added from components/explore/student-grid.tsx
  isVerified?: boolean; // Added from lib/relationships.ts

  // Privacy Objects (for each field)
  privacy_profile: PrivacyObject;
  privacy_contact_email: PrivacyObject;
  privacy_socials: PrivacyObject;
  privacy_birth_day: PrivacyObject;
  privacy_birth_month: PrivacyObject;
  privacy_contact_whatsapp: PrivacyObject;
  privacy_birth_year: PrivacyObject;
  privacy_contact_phone: PrivacyObject;
  privacy_contact_alt_email: PrivacyObject;
  privacy_contact_alt_phone: PrivacyObject;
  privacy_contact_telegram: PrivacyObject;
  privacy_permanentAddress: PrivacyObject;
  privacy_currentAddress: PrivacyObject;
  privacy_profileImage: PrivacyObject;
  privacy_bio: PrivacyObject;
  privacy_hostelHistory: PrivacyObject;
  privacy_hostelMemories: PrivacyObject;
  privacy_professionalInfo?: PrivacyObject;
}

export interface UserPreferences {
  id: string;
  registeredEmail: string;
  collegeId: string;
  batch: string;
  theme: 'light' | 'dark' | 'system';
  interestedStudents: { [studentId: string]: number };
  interestedColleges: { [collegeId: string]: number };
  collegeWisePreferences: boolean;
  defaultState: string;
  preferenceWeights: {
    collegeWeight: number;
    studentWeight: number;
    mutualBoost: number;
    stateBonus: number;
    popularityWeight: number;
    activityWeight: number;
  };
}

export interface Comment {
  commentorId: string;
  comment: string;
  upvotes: number;
  timestamp: string; // ISO date string
}

export interface AcademicContent {
  id: string;
  contentType: string;
  degreeId: string;
  courseId: string;
  subjectId: string;
  collegeId: string;
  uploaderId: string;
  collegeSpecific: boolean;
  contentURL: string;
  contentTitle: string;
  contentPhotoURL: string;
  description: string;
  tags: string[];
  likes: number;
  downloads: number;
  createdAt: string; // ISO date string
  updatedAt?: string; // ISO date string
  comments: Comment[];
  academicSystem?: 'year' | 'semester';
  semesterTag?: string;
}

export interface ContributorInfo {
  studentId: string;
  role: string;
  order: number;
}

export interface ExternalContributor {
  type: 'external';
  name: string;
  role: string;
  imageUrl: string;
  bio: string;
  website?: string;
  socials?: SocialLink[];
}

export interface ContributorsData {
  team: ContributorInfo[];
  external: ExternalContributor[];
}

export interface FeedPost {
  id: string;
  authorId: string;
  content: string;
  timestamp: string;
  likes: string[]; // array of studentIds
  comments: Comment[];
}

export interface Feed {
  posts: FeedPost[];
}

export interface MarketplaceItem {
  id: string;
  sellerId: string;
  sellerName: string;
  sellerAvatar: string;
  itemName: string;
  category: string;
  price: number;
  description: string;
  thumbnailUrl: string;
  images: string[];
  postedAt: string;
  faqs: { question: string; answer: string }[];
}

export type Marketplace = MarketplaceItem[];

export interface Notification {
  id: string;
  recipientId: string;
  type: 'like' | 'comment' | 'mention' | 'friend_request';
  senderId: string;
  resourceId: string; // e.g., post ID, comment ID
  read: boolean;
  timestamp: string;
}

export interface Notifications {
  [recipientId: string]: Notification[];
}

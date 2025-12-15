import {
  Student,
  College,
  UserPreferences,
  AcademicContent,
  AcademicStructure,
  ContributorsData,
  Feed,
  Marketplace,
  Notifications,
  PrivacyLevel,
  PrivacyObject,
} from './types';
import path from 'path';
import { promises as fs } from 'fs';

// Define the absolute paths to the JSON files in the 'data' directory
const dataDirPath = path.join(process.cwd(), 'data');

const collegesFilePath = path.join(dataDirPath, 'colleges.json');
const studentsFilePath = path.join(dataDirPath, 'studentLight.json');
const userPreferencesFilePath = path.join(
  dataDirPath,
  'currentUserPreferenceData.json'
);
const academicContentFilePath = path.join(dataDirPath, 'academic-content.json');
const academicStructureFilePath = path.join(
  dataDirPath,
  'academic-structure.json'
);
const contributorsFilePath = path.join(dataDirPath, 'contributors.json');
const feedFilePath = path.join(dataDirPath, 'feed.json');
const marketplaceFilePath = path.join(dataDirPath, 'marketplace.json');
const notificationsFilePath = path.join(dataDirPath, 'notifications.json');

// In-memory cache for the data
let colleges: College[] = [];
let students: { [key: string]: Student } = {};
let userPreferences: UserPreferences | null = null;
let academicContent: AcademicContent[] = [];
let academicStructure: AcademicStructure = [];
let contributors: ContributorsData | null = null;
let feed: Feed | null = null;
let marketplace: Marketplace | null = null;
let notifications: Notifications | null = null;

// Generic file reader
async function readFile<T>(filePath: string, defaultValue: T): Promise<T> {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data) as T;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      console.warn(`File not found: ${filePath}. Using default value.`);
      return defaultValue;
    } else {
      console.error(`Failed to read or parse ${filePath}:`, error);
      return defaultValue;
    }
  }
}

// --- Data Transformation ---

function transformStudentData(
  rawStudents: { [key: string]: any },
  collegeId: string
): { [key: string]: Student } {
  const transformedStudents: { [key: string]: Student } = {};

  for (const key in rawStudents) {
    const rawStudent = rawStudents[key];
    const [name_first, ...name_last_parts] = (rawStudent.fullName || '').split(
      ' '
    );
    const name_last = name_last_parts.join(' ');

    const toPrivacyObject = (level: PrivacyLevel | undefined): PrivacyObject => ({
      level: level || 'onlyMe',
      seniority: 'all',
      gender: 'all',
    });

    transformedStudents[key] = {
      id: rawStudent.Id,
      clerkUserId: rawStudent.clerkUserId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      slug: rawStudent.slug,
      role: rawStudent.role,
      accountStatus: rawStudent.accountStatus,
      deletedAt: rawStudent.deletedAt,
      name_first,
      name_last,
      gender: rawStudent.gender,
      collegeId: collegeId, // Assign hardcoded college ID
      degree: 'MBBS', // Default value
      admissionYear: rawStudent.admissionYear,
      collegeBatch: rawStudent.collegeBatch,
      passedOut: rawStudent.passedOut,
      contact_email: rawStudent.contact_email,
      contact_phone: rawStudent.contact_Phone,
      contact_whatsapp: rawStudent.contact_Whatsapp,
      contact_telegram: rawStudent.contact_telegram,
      socials: rawStudent.socials || [],
      profileImage: rawStudent.profileImage,
      birth_day: rawStudent.birth_day,
      birth_month: rawStudent.birth_month,
      bio: rawStudent.bio,
      hostelHistory: [], // Default
      hostelMemories: { images: [], videos: [] }, // Default

      // --- Transform privacy settings ---
      privacy_profile: toPrivacyObject(rawStudent.profilePrivacy),
      privacy_profileImage: toPrivacyObject(rawStudent.privacy_profile_image),
      privacy_contact_email: toPrivacyObject(rawStudent.privacy_contact_email),
      privacy_contact_phone: toPrivacyObject(rawStudent.privacy_contact_Phone),
      privacy_contact_whatsapp: toPrivacyObject(
        rawStudent.Privacy_contact_Whatsapp
      ),
      privacy_contact_telegram: toPrivacyObject(
        rawStudent.privacy_contact_telegram
      ),
      privacy_permanentAddress: toPrivacyObject(rawStudent.privacy_address),
      privacy_currentAddress: toPrivacyObject(rawStudent.privacy_address), // Assuming same for current
      privacy_birth_day: toPrivacyObject(rawStudent.privacy_birth_day),
      privacy_birth_month: toPrivacyObject(rawStudent.privacy_birth_month),
      
      // Defaulting other privacy objects
      privacy_socials: toPrivacyObject('collegeBuddy'),
      privacy_birth_year: toPrivacyObject('collegeBuddy'),
      privacy_contact_alt_email: toPrivacyObject('onlyMe'),
      privacy_contact_alt_phone: toPrivacyObject('onlyMe'),
      privacy_bio: toPrivacyObject('collegeBuddy'),
      privacy_hostelHistory: toPrivacyObject('onlyMe'),
      privacy_hostelMemories: toPrivacyObject('onlyMe'),
    };
  }
  return transformedStudents;
}

export async function loadData() {
  const COMJNMH_ID = 'b16b7458-1d89-4143-9b3c-7d6d7a6d1859';
  
  // Use Promise.all to load all data in parallel
  const [
    loadedColleges,
    rawStudents,
    loadedUserPreferences,
    loadedAcademicContent,
    loadedAcademicStructure,
    loadedContributors,
    loadedFeed,
    loadedMarketplace,
    loadedNotifications,
  ] = await Promise.all([
    readFile<College[]>(collegesFilePath, []),
    readFile<{ [key: string]: any }>(studentsFilePath, {}), // Load as raw data
    readFile<UserPreferences | null>(userPreferencesFilePath, null),
    readFile<AcademicContent[]>(academicContentFilePath, []),
    readFile<AcademicStructure>(academicStructureFilePath, []),
    readFile<ContributorsData | null>(contributorsFilePath, null),
    readFile<Feed | null>(feedFilePath, null),
    readFile<Marketplace | null>(marketplaceFilePath, null),
    readFile<Notifications | null>(notificationsFilePath, null),
  ]);

  // Transform student data before caching
  colleges = loadedColleges;
  students = transformStudentData(rawStudents, COMJNMH_ID);
  userPreferences = loadedUserPreferences;
  academicContent = loadedAcademicContent;
  academicStructure = loadedAcademicStructure;
  contributors = loadedContributors;
  feed = loadedFeed;
  marketplace = loadedMarketplace;
  notifications = loadedNotifications;
}

// Generic file writer with backup
async function saveData<T>(filePath: string, data: T) {
  const backupFilePath = `${filePath}.bak_${new Date()
    .toISOString()
    .replace(/[:.]/g, '-')}`;
  try {
    await fs.access(filePath);
    await fs.copyFile(filePath, backupFilePath);
    console.log(`Backed up ${path.basename(filePath)}`);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
      console.error(
        `Error creating backup for ${path.basename(filePath)}:`,
        error
      );
    }
  }

  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}

// Getter functions
export const getColleges = () => colleges;
export const getStudents = () => students;
export const getStudentsAsArray = () => Object.values(students);
export const getStudentById = (id: string) => students[id];
export const getUserPreferences = () => userPreferences;
export const getAcademicContent = () => academicContent;
export const getAcademicStructure = () => academicStructure;
export const getContributors = () => contributors;
export const getFeed = () => feed;
export const getMarketplace = () => marketplace;
export const getNotifications = () => notifications;

// Setter/Save functions
export async function saveStudents(updatedStudents: {
  [key: string]: Student;
}) {
  students = updatedStudents;
  // Note: Saving will overwrite studentLight.json with the transformed, full structure.
  // This could be desirable or not, depending on the workflow.
  await saveData(studentsFilePath, updatedStudents);
}

export async function saveColleges(updatedColleges: College[]) {
  colleges = updatedColleges;
  await saveData(collegesFilePath, updatedColleges);
}

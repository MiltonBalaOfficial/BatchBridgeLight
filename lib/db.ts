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
} from './types';
import path from 'path';
import { promises as fs } from 'fs';

// Define the absolute paths to the JSON files in the 'data' directory
const dataDirPath = path.join(process.cwd(), 'data');

const collegesFilePath = path.join(dataDirPath, 'colleges.json');
const studentsFilePath = path.join(dataDirPath, 'students.json');
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
    console.error(`Failed to read or parse ${filePath}:`, error);
    return defaultValue;
  }
}

export async function loadData() {
  // Use Promise.all to load all data in parallel for efficiency
  [
    colleges,
    students,
    userPreferences,
    academicContent,
    academicStructure,
    contributors,
    feed,
    marketplace,
    notifications,
  ] = await Promise.all([
    readFile<College[]>(collegesFilePath, []),
    readFile<{ [key: string]: Student }>(studentsFilePath, {}),
    readFile<UserPreferences | null>(userPreferencesFilePath, null),
    readFile<AcademicContent[]>(academicContentFilePath, []),
    readFile<AcademicStructure>(academicStructureFilePath, []),
    readFile<ContributorsData | null>(contributorsFilePath, null),
    readFile<Feed | null>(feedFilePath, null),
    readFile<Marketplace | null>(marketplaceFilePath, null),
    readFile<Notifications | null>(notificationsFilePath, null),
  ]);
}

// Generic file writer with backup
async function saveData<T>(filePath: string, data: T) {
  const backupFilePath = `${filePath}.bak_${new Date().toISOString().replace(/[:.]/g, '-')}`;
  try {
    // Check if file exists before trying to back it up
    await fs.access(filePath);
    await fs.copyFile(filePath, backupFilePath);
    console.log(`Backed up ${path.basename(filePath)}`);
  } catch (error) {
    // If file doesn't exist, ENOENT is expected, so we can ignore it.
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
      console.error(
        `Error creating backup for ${path.basename(filePath)}:`,
        error
      );
    }
  }

  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
  // No need to reload data manually if we update the in-memory cache directly
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
  await saveData(studentsFilePath, updatedStudents);
}

export async function saveColleges(updatedColleges: College[]) {
  colleges = updatedColleges;
  await saveData(collegesFilePath, updatedColleges);
}

// Add other save functions as needed...

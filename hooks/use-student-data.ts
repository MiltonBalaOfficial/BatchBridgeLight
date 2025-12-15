import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { Student, College, PrivacyObject, PrivacyLevel } from '@/lib/types'; // Import College and Privacy types
import studentData from '@/data/studentLight.json';

// Helper function to transform string privacy levels to PrivacyObject
const transformPrivacyStringToObject = (
  privacyString: string | undefined
): PrivacyObject | undefined => {
  if (!privacyString) return undefined;
  // Cast to PrivacyLevel, assuming the strings in JSON match PrivacyLevel types
  return { level: privacyString as PrivacyLevel };
};

export function useStudentData() {
  const { user } = useUser();
  const [students, setStudents] = useState<Student[]>([]);
  const [currentUser, setCurrentUser] = useState<Student | null>(null);
  const [batches, setBatches] = useState<{ value: string; label: string }[]>(
    []
  );
  const [colleges, setColleges] = useState<College[]>([]); // Correctly type colleges
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const processData = () => {
      try {
        setLoading(true);
        const rawStudentArray = Object.values(studentData);

        // Transform raw data to match Student type with PrivacyObject
        const transformedStudents: Student[] = rawStudentArray.map(
          (raw: any) => {
            const transformedStudent: Student = {
              ...raw,
              // Explicitly transform string privacy fields to PrivacyObject
              privacy_contact_email: transformPrivacyStringToObject(
                raw.privacy_contact_email
              ),
              privacy_contact_phone: transformPrivacyStringToObject(
                raw.privacy_contact_Phone
              ), // Note: raw uses _Phone
              privacy_contact_whatsapp: transformPrivacyStringToObject(
                raw.Privacy_contact_Whatsapp
              ), // Note: raw uses Privacy_
              privacy_contact_telegram: transformPrivacyStringToObject(
                raw.privacy_contact_telegram
              ),
              privacy_address: transformPrivacyStringToObject(
                raw.privacy_address
              ),
              privacy_birth_day: transformPrivacyStringToObject(
                raw.privacy_birth_day
              ),
              privacy_birth_month: transformPrivacyStringToObject(
                raw.privacy_birth_month
              ),
              privacy_profileImage: transformPrivacyStringToObject(
                raw.privacy_profile_image
              ), // Note: raw uses _image
              privacy_bio: transformPrivacyStringToObject(raw.privacy_bio),
              privacy_profile: transformPrivacyStringToObject(
                raw.profilePrivacy
              ), // Transform top-level profilePrivacy

              // Ensure correct casing for contact fields when available
              contact_phone: raw.contact_Phone,
              contact_whatsapp: raw.contact_Whatsapp,

              // Handle name_first and name_last if not present
              name_first: raw.name_first || raw.fullName.split(' ')[0],
              name_last:
                raw.name_last || raw.fullName.split(' ').slice(1).join(' '),
            };
            return transformedStudent;
          }
        );

        setStudents(transformedStudents);

        // Find current user
        if (user) {
          const email = user.primaryEmailAddress?.emailAddress;
          const foundUser =
            transformedStudents.find((s) => s.contact_email === email) || null;
          setCurrentUser(foundUser);
        }

        // Extract unique batches
        const uniqueBatches = [
          ...new Set(
            transformedStudents
              .map((s) => s.admissionYear)
              .filter((year): year is number => year !== undefined)
          ),
        ];
        uniqueBatches.sort((a, b) => b - a);
        setBatches(
          uniqueBatches.map((year) => ({
            value: year.toString(),
            label: `Batch ${year}`,
          }))
        );

        setColleges([]);

        setLoading(false);
      } catch (e: any) {
        setError('Failed to load or process student data: ' + e.message);
        setLoading(false);
      }
    };

    processData();
  }, [user]);

  return { students, currentUser, batches, colleges, loading, error };
}

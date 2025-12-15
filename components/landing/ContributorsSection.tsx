'use client';

import { useEffect, useState } from 'react';
import { Student, College } from '@/lib/types';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { ChevronsUpDown } from 'lucide-react';
import { ContributorCard, MergedContributor } from './ContributorCard';
import { StudentDetailsDialog } from '@/components/explore/student-details-dialog-professional'; // Import StudentDetailsDialog
import { PatronsSection } from './PatronsSection';

interface ContributorInfo {
  studentId: string;
  role: string;
  order: number;
}

interface ExternalContributor {
  type: 'external';
  name: string;
  role: string;
  imageUrl: string;
  bio: string;
  website?: string;
  socials?: { type: string; url: string }[];
}

interface ContributorsData {
  team: ContributorInfo[];
  external: ExternalContributor[];
}

export function ContributorsSection() {
  const [team, setTeam] = useState<MergedContributor[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [colleges, setColleges] = useState<College[]>([]); // State to store colleges data
  const [selectedStudentForDialog, setSelectedStudentForDialog] =
    useState<Student | null>(null);
  const [isStudentDetailsDialogOpen, setIsStudentDetailsDialogOpen] =
    useState(false);

  useEffect(() => {
    Promise.all([
      fetch('/api/developers').then((res) => res.json()),
      fetch('/api/students').then((res) => res.json()), // Fetch from API
      fetch('/api/colleges').then((res) => res.json()), // Fetch colleges data
    ])
      .then(
        ([contributorsData, studentsData, collegesData]: [
          ContributorsData,
          Student[], // The API returns an array of students
          College[], // Type for collegesData
        ]) => {
          // Create a map of students for easier lookup
          const studentsMap = new Map(studentsData.map((s) => [s.Id, s])); // Corrected to s.Id

          const mergedTeam = contributorsData.team
            .sort((a, b) => a.order - b.order)
            .map((info) => {
              const student = studentsMap.get(info.studentId);
              if (!student) return null; // Or handle missing student
              return {
                ...student,
                role: info.role,
                studentId: info.studentId,
                type: 'student' as const,
              };
            })
            .filter((p) => p !== null); // Filter out nulls

          const allMembers = [...mergedTeam, ...contributorsData.external];
          setTeam(allMembers);
          setColleges(collegesData); // Set colleges data
          setLoading(false);
        }
      )
      .catch((error) => {
        console.error('Error fetching contributors data:', error);
        setLoading(false);
      });
  }, []);

  const handleCardClick = (person: MergedContributor) => {
    if (person.type === 'student') {
      // Open StudentDetailsDialog for students
      setSelectedStudentForDialog(person as Student);
      setIsStudentDetailsDialogOpen(true);
    } else if (person.website) {
      // Open website for external contributors
      window.open(person.website, '_blank');
    }
  };

  // const handleCloseStudentDetailsDialog = () => {
  //   setSelectedStudentForDialog(null);
  //   setIsStudentDetailsDialogOpen(false);
  // };

  if (loading) {
    return null; // Don't show anything while loading
  }

  return (
    <>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <section className='pt-24 pb-12'>
          <div className='container mx-auto px-4 text-center'>
            <h2 className='text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-slate-100'>
              Meet the Team & Patrons
            </h2>
            <p className='mx-auto mt-4 max-w-3xl text-lg text-slate-600 dark:text-slate-300'>
              The passionate individuals and generous patrons working together
              to create and grow this platform.
            </p>

            <div className='mt-8'>
              <CollapsibleTrigger asChild>
                <Button variant='outline'>
                  {isOpen ? 'Hide Team & Patrons' : 'Show Team & Patrons'}
                  <ChevronsUpDown className='ml-2 h-4 w-4' />
                </Button>
              </CollapsibleTrigger>
            </div>
          </div>
        </section>

        <CollapsibleContent asChild>
          <section className='pb-24'>
            <div className='container mx-auto px-4'>
              <div className='grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
                {team.map((person) => (
                  <ContributorCard
                    key={person.type === 'student' ? person.Id : person.name} // Corrected to person.Id
                    person={person}
                    onClick={() => handleCardClick(person)}
                    colleges={colleges}
                  />
                ))}
              </div>
              <PatronsSection />
              <div className='mt-8 flex justify-center'>
                <CollapsibleTrigger asChild>
                  <Button variant='ghost'>Close</Button>
                </CollapsibleTrigger>
              </div>
            </div>
          </section>
        </CollapsibleContent>
      </Collapsible>
      <StudentDetailsDialog
        student={selectedStudentForDialog}
        open={isStudentDetailsDialogOpen}
        onOpenChange={setIsStudentDetailsDialogOpen}
        colleges={colleges}
        currentUser={null} // Public page, no current user context
      />
    </>
  );
}

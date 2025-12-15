'use client';

import { useState, useMemo } from 'react';
import { ExploreLightSidebar } from '@/components/sidebar/explore-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { ExploreHeader } from '@/components/layout/explore-header';
import { StudentGrid } from '@/components/explore/student-grid';
import { StudentDetailsDialog } from '@/components/explore/student-details-dialog-professional';
import { Student } from '@/lib/types';
import { filterStudents } from '@/lib/student-utils';

interface ExploreLightClientProps {
  students: Student[];
  currentUser: Student | null;
  batches: { value: string; label: string }[];
}

export default function ExploreLightClient({
  students,
  currentUser,
  batches,
}: ExploreLightClientProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState('members');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [batch, setBatch] = useState<string | null>('all');

  const handleStudentClick = (student: Student) => {
    setSelectedStudent(student);
    setDialogOpen(true);
  };

  const filteredStudents = useMemo(() => {
    if (!currentUser || !students) {
      return [];
    }
    return filterStudents(students, currentUser, batch);
  }, [students, currentUser, batch]);

  const MainContent = () => {
    if (!currentUser) {
      return (
        <div className='flex h-full flex-col items-center justify-center text-center'>
          <h2 className='text-xl font-semibold'>Create Your Student Profile</h2>
          <p className='text-muted-foreground'>
            It looks like you haven't created your student profile yet.
          </p>
          <p className='mt-4 text-sm text-muted-foreground'>
            Please go to the admin section to create your profile to continue.
          </p>
        </div>
      );
    }
    if (filteredStudents.length === 0) {
      return (
        <div className='flex h-full flex-col items-center justify-center text-center'>
          <h2 className='text-xl font-semibold'>No Students Found</h2>
          <p className='text-muted-foreground'>
            Try adjusting your filters or check back later.
          </p>
        </div>
      );
    }
    return (
      <StudentGrid
        students={filteredStudents}
        onStudentClick={handleStudentClick}
        currentUser={currentUser}
      />
    );
  };

  return (
    <SidebarProvider open={sidebarOpen} onOpenChange={setSidebarOpen}>
      <ExploreLightSidebar
        batch={batch}
        onBatchChange={setBatch}
        activeMenu={activeMenu}
        onMenuChange={setActiveMenu}
        batches={batches}
        loadingBatches={false}
        currentUser={currentUser}
      />

      <SidebarInset>
        <div className='flex h-dvh flex-col'>
          <ExploreHeader />
          <main className='flex-1 overflow-y-auto p-4 sm:p-6 md:p-8'>
            <MainContent />
          </main>
        </div>
      </SidebarInset>

      <StudentDetailsDialog
        student={selectedStudent}
        currentUser={currentUser}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </SidebarProvider>
  );
}

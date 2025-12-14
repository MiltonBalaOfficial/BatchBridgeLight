'use client';

import { useState } from 'react';
import { AppSidebar } from '@/components/sidebar/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { useExplore } from '@/hooks/use-explore';
import { ExploreHeader } from '@/components/layout/explore-header';
import { StudentGrid } from '@/components/explore/student-grid';
import { Student } from '@/lib/types';
import { StudentDetailsDialog } from '@/components/explore/student-details-dialog-professional';
import { DashboardHome } from '@/components/explore/dashboard-home';
import { Input } from '@/components/ui/input';
import { Feed } from '@/components/explore/Feed';
import { Notifications } from '@/components/explore/Notifications';
import { AcademicContentView } from '@/components/academic-content/academic-content-view';
import { Marketplace } from '@/components/explore/marketplace/Marketplace';

import { Button } from '@/components/ui/button';
import { Users } from 'lucide-react';

export default function ExplorePage() {
  const {
    currentUser,
    loadingUser,
    selectedCollege,
    handleCollegeChange,
    selectedBatch,
    handleBatchChange,
    sortedStudents,
    loadingStudents,
    colleges,
    batches,
    loadingBatches,
    searchTerm,
    setSearchTerm,
  } = useExplore();

  const [open, setOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState('members');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const handleStudentClick = (student: Student) => {
    setSelectedStudent(student);
  };

  const handleCloseDialog = () => {
    setSelectedStudent(null);
  };

  if (loadingUser) {
    return (
      <div className='flex h-screen items-center justify-center'>
        <div>Loading user data...</div>
      </div>
    );
  }

  return (
    <SidebarProvider open={open} onOpenChange={setOpen}>
      <AppSidebar
        collegeId={selectedCollege}
        batch={selectedBatch}
        onCollegeChange={handleCollegeChange}
        onBatchChange={handleBatchChange}
        activeMenu={activeMenu}
        onMenuChange={setActiveMenu}
        batches={batches}
        loadingBatches={loadingBatches}
      />

      <SidebarInset>
        <div className='flex h-dvh flex-col'>
          <ExploreHeader />

          <main className='flex-1 overflow-y-auto p-4 sm:p-6 md:p-8'>
            {activeMenu === 'notifications' && <Notifications />}
            {activeMenu === 'dashboard' && (
              <DashboardHome currentUser={currentUser} />
            )}
            {activeMenu === 'feed' && <Feed />}
            {activeMenu === 'academic-content' && (
              <AcademicContentView
                selectedCollege={selectedCollege}
                handleCollegeChange={handleCollegeChange}
                colleges={colleges}
              />
            )}
            {activeMenu === 'marketplace' && (
              <Marketplace
                onSellerClick={handleStudentClick}
                currentUser={currentUser}
                colleges={colleges}
              />
            )}
            {activeMenu === 'members' && (
              <div>
                <div className='mb-4'>
                  <Input
                    type='text'
                    placeholder='Search students by name, college, year...'
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className='w-full'
                  />
                </div>
                {loadingStudents || !currentUser ? (
                  <div className='flex h-[60vh] flex-col items-center justify-center'>
                    <p className='text-lg font-semibold'>Loading...</p>
                  </div>
                ) : sortedStudents.length > 0 ? (
                  <StudentGrid
                    students={sortedStudents}
                    colleges={colleges}
                    onStudentClick={handleStudentClick}
                    currentUser={currentUser}
                  />
                ) : (
                  <div className='flex h-[60vh] flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 p-12 text-center'>
                    <Users className='h-12 w-12 text-muted-foreground' />
                    <h3 className='mt-4 text-lg font-semibold'>
                      No Students Found
                    </h3>
                    <p className='mt-2 text-sm text-muted-foreground'>
                      No students match the selected college and batch criteria.
                    </p>
                    <Button
                      variant='outline'
                      className='mt-4'
                      onClick={() => {
                        handleCollegeChange('all');
                        handleBatchChange('all');
                        setSearchTerm('');
                      }}
                    >
                      Reset Filters
                    </Button>
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      </SidebarInset>

      <StudentDetailsDialog
        currentUser={currentUser}
        student={selectedStudent}
        open={!!selectedStudent}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            handleCloseDialog();
          }
        }}
        colleges={colleges}
      />
    </SidebarProvider>
  );
}

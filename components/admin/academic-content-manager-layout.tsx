'use client';

import { useState } from 'react';
import { AcademicStructureNavigator } from '@/components/admin/academic-content/academic-structure-navigator';
import { AcademicContentList } from '@/components/admin/academic-content/academic-content-list';
import { AcademicContentForm } from '@/components/admin/academic-content-form'; // New import
import { AcademicNode, AcademicContent } from '@/lib/types'; // AcademicContent new import
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { useAcademicStructure } from '@/hooks/use-academic-structure'; // New import

import {
  Breadcrumb,
  BreadcrumbItem,
  // BreadcrumbLink, // Removed - Not used
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

export function AcademicContentManagerLayout() {
  const { getAcademicPathNamesByIds } = useAcademicStructure();

  const [selectedDegreeId, setSelectedDegreeId] = useState<string | undefined>(
    undefined
  );
  const [selectedCourseId, setSelectedCourseId] = useState<string | undefined>(
    undefined
  );
  const [selectedSubjectId, setSelectedSubjectId] = useState<
    string | undefined
  >(undefined);

  const [academicPathForForm, setAcademicPathForForm] = useState<
    | {
        degree?: string;
        course?: string;
        subject?: string;
      }
    | undefined
  >(undefined); // New state for academic path names

  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingContentId, setEditingContentId] = useState<string | null>(null);
  const [initialFormDataForForm, setInitialFormDataForForm] = useState<
    Partial<AcademicContent> | undefined
  >(undefined);
  const [refreshListTrigger, setRefreshListTrigger] = useState(0); // To force AcademicContentList refresh
  const [subjectSelected, setSubjectSelected] = useState(false); // New state for content visibility

  const handleAcademicNodeSelect = (
    node: AcademicNode,
    degreeId: string | undefined,
    courseId: string | undefined,
    subjectId: string | undefined,
    degreeName: string | undefined, // New
    courseName: string | undefined, // New
    subjectName: string | undefined // New
  ) => {
    setSelectedDegreeId(degreeId);
    setSelectedCourseId(courseId);
    setSelectedSubjectId(subjectId);
    setAcademicPathForForm({
      degree: degreeName,
      course: courseName,
      subject: subjectName,
    }); // Update academic path names
    setSubjectSelected(true); // A subject has been selected

    // When a node is selected, if the form is visible, we might want to pre-fill it for new content
    // Or if the form is not visible, it updates filters for the list.
    if (isFormVisible && !editingContentId) {
      // Only pre-fill if adding new content
      setInitialFormDataForForm((prev) => ({
        ...prev,
        degreeId: degreeId,
        courseId: courseId,
        subjectId: subjectId,
      }));
    }
  };

  const handleAddNewContent = () => {
    setEditingContentId(null);
    setInitialFormDataForForm({
      degreeId: selectedDegreeId,
      courseId: selectedCourseId,
      subjectId: selectedSubjectId,
      likes: 0,
      downloads: 0,
      comments: [],
      collegeSpecific: false,
    });
    setIsFormVisible(true);
  };

  const handleEditContent = async (contentId: string) => {
    try {
      const res = await fetch(`/api/academic-content?id=${contentId}`);
      if (!res.ok) {
        throw new Error('Failed to fetch academic content for editing');
      }
      const data: AcademicContent = await res.json();
      setEditingContentId(contentId);
      // When editing, initialFormDataForForm should contain all existing data
      setInitialFormDataForForm(data);

      // Also set academic path for editing based on fetched content
      const pathData = getAcademicPathNamesByIds(
        data.degreeId,
        data.courseId,
        data.subjectId
      );
      setAcademicPathForForm(pathData);

      setIsFormVisible(true);
    } catch (error) {
      console.error('Error fetching content for edit:', error);
      alert('Failed to load content for editing.');
    }
  };

  const handleFormSave = () => {
    setIsFormVisible(false);
    setEditingContentId(null);
    setInitialFormDataForForm(undefined);
    setAcademicPathForForm(undefined); // Reset academic path
    setRefreshListTrigger((prev) => prev + 1); // Trigger list refresh
  };

  const handleFormCancel = () => {
    setIsFormVisible(false);
    setEditingContentId(null);
    setInitialFormDataForForm(undefined);
    setAcademicPathForForm(undefined); // Reset academic path
  };

  return (
    <div className='grid grid-cols-1 gap-8 p-4 md:p-6 lg:grid-cols-[350px_1fr]'>
      <aside className='h-[calc(100vh-theme(spacing.16))] overflow-y-auto rounded-lg border p-4'>
        <h3 className='mb-4 text-lg font-semibold'>Academic Structure</h3>
        <p className='mb-4 text-sm text-muted-foreground'>
          Select a subject to filter content or pre-fill for a new entry.
        </p>
        <AcademicStructureNavigator
          onNodeSelection={handleAcademicNodeSelect}
        />
      </aside>
      <main>
        <div className='mb-6 flex items-center justify-between'>
          <h1 className='text-2xl font-bold tracking-tight'>
            Academic Content Manager
          </h1>
          <Button onClick={handleAddNewContent} disabled={!subjectSelected}>
            <PlusCircle className='mr-2 h-4 w-4' /> Add New Content
          </Button>
        </div>

        {academicPathForForm &&
          (academicPathForForm.degree ||
            academicPathForForm.course ||
            academicPathForForm.subject) && (
            <Breadcrumb className='mb-4'>
              <BreadcrumbList>
                {academicPathForForm.degree && (
                  <>
                    <BreadcrumbItem>
                      <BreadcrumbPage>
                        {academicPathForForm.degree}
                      </BreadcrumbPage>
                    </BreadcrumbItem>
                    {(academicPathForForm.course ||
                      academicPathForForm.subject) && <BreadcrumbSeparator />}
                  </>
                )}
                {academicPathForForm.course && (
                  <>
                    <BreadcrumbItem>
                      <BreadcrumbPage>
                        {academicPathForForm.course}
                      </BreadcrumbPage>
                    </BreadcrumbItem>
                    {academicPathForForm.subject && <BreadcrumbSeparator />}
                  </>
                )}
                {academicPathForForm.subject && (
                  <BreadcrumbItem>
                    <BreadcrumbPage>
                      {academicPathForForm.subject}
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                )}
              </BreadcrumbList>
            </Breadcrumb>
          )}

        {isFormVisible ? (
          <AcademicContentForm
            content={initialFormDataForForm}
            isNew={!editingContentId}
            onSave={handleFormSave}
            onCancel={handleFormCancel}
            // academicPath={academicPathForForm} // No longer needed as breadcrumb is here
          />
        ) : subjectSelected ? ( // Only show list if a subject has been selected
          <AcademicContentList
            degreeId={selectedDegreeId}
            courseId={selectedCourseId}
            subjectId={selectedSubjectId}
            onEditContent={handleEditContent}
            key={refreshListTrigger} // Use key to force remount/re-fetch
          />
        ) : (
          <div className='flex h-full items-center justify-center text-muted-foreground'>
            <p>Select a subject from the sidebar to view content.</p>
          </div>
        )}
      </main>
    </div>
  );
}

'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { AcademicContent, College } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';
import { useUser } from '@clerk/nextjs';
import { TagInput } from '@/components/ui/tag-input';

const contentTypes = [
  'notes',
  'book',
  'video',
  'practical',
  'anki',
  'papers',
  'case-study',
  'question-paper',
];

interface AcademicContentFormProps {
  content?: Partial<AcademicContent>;
  isNew?: boolean;
  onSave: (savedContent: AcademicContent) => void;
  onCancel: () => void;
}

export const AcademicContentForm = ({
  content,
  isNew = false,
  onSave,
  onCancel,
}: AcademicContentFormProps) => {
  const { user } = useUser();

  const getInitialFormData = useCallback((): Partial<AcademicContent> => {
    if (content && !isNew) {
      return { ...content, tags: content.tags || [] };
    }
    return {
      likes: 0,
      downloads: 0,
      comments: [],
      collegeSpecific: false,
      semesterTag: 'not-semester-specific',
      tags: [],
    };
  }, [content, isNew]);

  const [formData, setFormData] =
    useState<Partial<AcademicContent>>(getInitialFormData());
  const [colleges, setColleges] = useState<College[]>([]);
  const [tagSuggestions, setTagSuggestions] = useState<string[]>([]);

  const [isSaving, setIsSaving] = useState(false);
  const [showUnsavedChangesDialog, setShowUnsavedChangesDialog] =
    useState(false);
  const initialFormData =
    useRef<Partial<AcademicContent>>(getInitialFormData());

  const hasUnsavedChanges = () => {
    return JSON.stringify(initialFormData.current) !== JSON.stringify(formData);
  };

  useEffect(() => {
    const fetchData = async () => {
      const [collegesRes, academicContentRes] = await Promise.all([
        fetch('/api/colleges'),
        fetch('/api/academic-content'),
      ]);
      const [collegesData, academicContentData]: [
        College[],
        AcademicContent[],
      ] = await Promise.all([collegesRes.json(), academicContentRes.json()]);
      setColleges(collegesData);

      const allTags = academicContentData.reduce(
        (acc: string[], content: AcademicContent) => {
          return [...acc, ...(content.tags || [])];
        },
        []
      );
      const hierarchicalTags = new Set<string>();
      allTags.forEach((tag) => {
        const parts = tag.split('::');
        for (let i = 1; i <= parts.length; i++) {
          hierarchicalTags.add(parts.slice(0, i).join('::'));
        }
      });
      setTagSuggestions([...hierarchicalTags]);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const initialData = getInitialFormData();
    setFormData(initialData);
    initialFormData.current = initialData;
  }, [getInitialFormData]);

  useEffect(() => {
    if (user && isNew) {
      const userCollegeId = user.publicMetadata?.collegeId as
        | string
        | undefined;
      setFormData((prev) => ({
        ...prev,
        uploaderId: user.id,
        collegeId: userCollegeId,
      }));
    }
  }, [user, isNew]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const parsedValue =
      type === 'number' && value !== '' ? parseInt(value, 10) : value;

    setFormData((prev) => ({
      ...prev,
      [name]: parsedValue,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
    if (name === 'collegeSpecific' && !checked) {
      const userCollegeId = user?.publicMetadata?.collegeId as
        | string
        | undefined;
      setFormData((prev) => ({
        ...prev,
        collegeId: userCollegeId,
      }));
    }
  };

  const handleTagsChange = (newTags: string[]) => {
    setFormData((prev) => ({
      ...prev,
      tags: newTags,
    }));
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSaving(true);

    const url = '/api/academic-content';
    const method = isNew ? 'POST' : 'PUT';

    const dataToSave: Partial<AcademicContent> = {
      ...formData,
      id: isNew ? uuidv4() : content?.id,
      createdAt: isNew ? new Date().toISOString() : content?.createdAt,
      updatedAt: new Date().toISOString(),
    };

    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dataToSave),
    });

    setIsSaving(false);

    if (response.ok) {
      initialFormData.current = dataToSave;
      onSave(dataToSave as AcademicContent);
    } else {
      const errorData = await response.json();
      console.error('Failed to save academic content:', errorData);
      alert(
        `Failed to save academic content: ${
          errorData.message || 'Unknown error'
        }`
      );
    }
  };

  const handleBack = () => {
    if (hasUnsavedChanges()) {
      setShowUnsavedChangesDialog(true);
    } else {
      onCancel();
    }
  };

  return (
    <>
      <div className='mb-4 flex items-center justify-between'>
        <Button variant='outline' onClick={handleBack}>
          Back
        </Button>
        <Button onClick={() => handleSubmit()} disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save'}
        </Button>
      </div>
      <AlertDialog
        open={showUnsavedChangesDialog}
        onOpenChange={setShowUnsavedChangesDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>You have unsaved changes</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to leave? Your changes will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => onCancel()}>
              Leave
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <form onSubmit={handleSubmit} className='space-y-8'>
        <Card id='main-info'>
          <CardHeader>
            <CardTitle>Main Content</CardTitle>
          </CardHeader>
          <CardContent className='space-y-6'>
            <div>
              <Label htmlFor='contentType'>Content Type</Label>
              <Select
                onValueChange={(value) =>
                  handleSelectChange('contentType', value)
                }
                value={formData.contentType}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder='Select a content type' />
                </SelectTrigger>
                <SelectContent>
                  {contentTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor='contentTitle'>Content Title</Label>
              <Input
                id='contentTitle'
                name='contentTitle'
                type='text'
                value={String(formData.contentTitle || '')}
                onChange={handleChange}
                required={true}
                placeholder=''
              />
            </div>
            <div>
              <Label htmlFor='description'>Description</Label>
              <Textarea
                id='description'
                name='description'
                value={String(formData.description || '')}
                onChange={handleChange}
                required={true}
                placeholder='A detailed description of the content...'
              />
            </div>
            <div>
              <Label htmlFor='contentURL'>Content URL</Label>
              <Input
                id='contentURL'
                name='contentURL'
                type='text'
                value={String(formData.contentURL || '')}
                onChange={handleChange}
                required={true}
                placeholder='e.g., /path/to/content.pdf or https://...'
              />
            </div>
            <div>
              <Label htmlFor='contentPhotoURL'>Photo URL</Label>
              <Input
                id='contentPhotoURL'
                name='contentPhotoURL'
                type='text'
                value={String(formData.contentPhotoURL || '')}
                onChange={handleChange}
                required={false}
                placeholder='e.g., /images/content/photo.jpg'
              />
            </div>
          </CardContent>
        </Card>

        <Card id='classification'>
          <CardHeader>
            <CardTitle>Classification</CardTitle>
          </CardHeader>
          <CardContent className='space-y-6'>
            <div>
              <Label htmlFor='tags'>Tags</Label>
              <TagInput
                value={formData.tags || []}
                onChange={handleTagsChange}
                placeholder='Add tags...'
                suggestions={tagSuggestions}
              />
            </div>
            <div>
              <Label htmlFor='semesterTag'>Semester</Label>
              <Select
                onValueChange={(value) =>
                  handleSelectChange('semesterTag', value)
                }
                value={formData.semesterTag}
              >
                <SelectTrigger>
                  <SelectValue placeholder='Select a semester' />
                </SelectTrigger>
                <SelectContent>
                  {[
                    'not-semester-specific',
                    'first-semester',
                    'second-semester',
                    'third-semester',
                  ].map((semester) => (
                    <SelectItem key={semester} value={semester}>
                      {semester}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className='flex items-center space-x-2'>
              <Switch
                id='collegeSpecific'
                name='collegeSpecific'
                checked={!!formData.collegeSpecific}
                onCheckedChange={(checked) =>
                  handleSwitchChange('collegeSpecific', checked)
                }
              />
              <Label htmlFor='collegeSpecific'>
                Is this content specific to a college?
              </Label>
            </div>
            {formData.collegeSpecific && (
              <div>
                <Label htmlFor='collegeId'>College</Label>
                <Select
                  onValueChange={(value) =>
                    handleSelectChange('collegeId', value)
                  }
                  value={formData.collegeId}
                  required={formData.collegeSpecific}
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Select a college' />
                  </SelectTrigger>
                  <SelectContent>
                    {colleges.map((college) => (
                      <SelectItem key={college.id} value={college.id}>
                        {college.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </CardContent>
        </Card>
      </form>
    </>
  );
};

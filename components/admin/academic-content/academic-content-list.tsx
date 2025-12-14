'use client';

import { useEffect, useState, useMemo } from 'react';
import { AcademicContent } from '@/lib/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';

interface AcademicContentListProps {
  degreeId?: string;
  courseId?: string;
  subjectId?: string;
  onEditContent: (contentId: string) => void;
}

export function AcademicContentList({
  degreeId,
  courseId,
  subjectId,
  onEditContent,
}: AcademicContentListProps) {
  const [allContent, setAllContent] = useState<AcademicContent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await fetch('/api/academic-content');
        if (!res.ok) {
          throw new Error('Failed to fetch academic content');
        }
        const data: AcademicContent[] = await res.json();
        setAllContent(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'An unknown error occurred'
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetchContent();
  }, []);

  const filteredContent = useMemo(() => {
    return allContent.filter((contentItem) => {
      let matches = true;

      // Filter by degree if degreeId is provided
      if (degreeId && contentItem.degreeId !== degreeId) {
        matches = false;
      }

      // Filter by course if courseId is provided
      // Only apply if degree matches or no degree filter is active
      if (matches && courseId && contentItem.courseId !== courseId) {
        matches = false;
      }

      // Filter by subject if subjectId is provided
      // Only apply if course (and implicitly degree) matches or no course filter is active
      if (matches && subjectId && contentItem.subjectId !== subjectId) {
        matches = false;
      }
      return matches;
    });
  }, [allContent, degreeId, courseId, subjectId]);

  if (isLoading) {
    return (
      <div className='py-10 text-center text-muted-foreground'>
        Loading academic content...
      </div>
    );
  }

  if (error) {
    return <div className='py-10 text-center text-red-500'>Error: {error}</div>;
  }

  return (
    <div className='space-y-4'>
      {filteredContent.length === 0 ? (
        <p className='text-muted-foreground'>
          No academic content found for the selected criteria.
        </p>
      ) : (
        filteredContent.map((contentItem) => (
          <Card key={contentItem.id}>
            <CardHeader className='flex flex-row items-center justify-between'>
              <CardTitle>{contentItem.contentTitle}</CardTitle>
              <Button
                variant='outline'
                size='sm'
                onClick={() => onEditContent(contentItem.id)}
              >
                <Pencil className='mr-2 h-4 w-4' /> Edit
              </Button>
            </CardHeader>
            <CardContent>
              <CardDescription>{contentItem.description}</CardDescription>
              <div className='mt-2 text-sm text-muted-foreground'>
                {contentItem.contentType && (
                  <p>Type: {contentItem.contentType}</p>
                )}
                {contentItem.degreeId && (
                  <p>Degree ID: {contentItem.degreeId}</p>
                )}
                {contentItem.courseId && (
                  <p>Course ID: {contentItem.courseId}</p>
                )}
                {contentItem.subjectId && (
                  <p>Subject ID: {contentItem.subjectId}</p>
                )}
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}

// components/academic-content/academic-content-view.tsx
'use client';

import * as React from 'react';
import {
  Book,
  Download,
  FileText,
  FlaskConical,
  GraduationCap,
  Heart,
  Layers,
  Link as LinkIcon,
  Search,
  ClipboardList,
  Video,
  MessageSquare,
  CalendarDays,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import Image from 'next/image';
import {
  College,
  AcademicContent,
  Student,
  AcademicStructure,
} from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { StudentDetailsDialog } from '../explore/student-details-dialog-professional';
import { useExplore } from '@/hooks/use-explore';
import { Separator } from '../ui/separator';
import { CommentDialog } from './comment-dialog';

const contentTypes = [
  { value: 'all', label: 'All Types' },
  { value: 'notes', label: 'Notes', icon: <FileText className='h-4 w-4' /> },
  { value: 'book', label: 'Books', icon: <Book className='h-4 w-4' /> },
  { value: 'video', label: 'Videos', icon: <Video className='h-4 w-4' /> },
  {
    value: 'practical',
    label: 'Practical',
    icon: <FlaskConical className='h-4 w-4' />,
  },
  { value: 'anki', label: 'Anki', icon: <Layers className='h-4 w-4' /> },
  {
    value: 'papers',
    label: 'Papers',
    icon: <GraduationCap className='h-4 w-4' />,
  },
  {
    value: 'case-study',
    label: 'Case Study',
    icon: <ClipboardList className='h-4 w-4' />,
  },
];

interface AcademicContentViewProps {
  selectedCollege: string | null;
  handleCollegeChange: (collegeId: string) => void;
  colleges: College[];
}

export function AcademicContentView({
  selectedCollege,
  handleCollegeChange,
  colleges,
}: AcademicContentViewProps) {
  const { currentUser } = useExplore();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [students, setStudents] = React.useState<{ [id: string]: Student }>({});
  const [academicStructure, setAcademicStructure] =
    React.useState<AcademicStructure>([]);
  const [academicContent, setAcademicContent] = React.useState<
    AcademicContent[]
  >([]);
  const [loading, setLoading] = React.useState(true);
  const [showContent, setShowContent] = React.useState(false);

  const [selectedDegree, setSelectedDegree] = React.useState<string>('');
  const [selectedCourse, setSelectedCourse] = React.useState<string>('');
  const [selectedSubject, setSelectedSubject] = React.useState<string>('');
  const [selectedContentType, setSelectedContentType] =
    React.useState<string>('all');
  const [filterByMyCollege, setFilterByMyCollege] = React.useState(false);

  const [selectedStudent, setSelectedStudent] = React.useState<Student | null>(
    null
  );
  const [selectedContentForComments, setSelectedContentForComments] =
    React.useState<AcademicContent | null>(null);

  const initialized = React.useRef(false);

  React.useEffect(() => {
    Promise.all([
      fetch('/api/academic-structure').then((res) => res.json()),
      fetch('/api/academic-content').then((res) => res.json()),
      fetch('/api/students').then((res) => res.json()),
    ])
      .then(([structureData, contentData, studentsData]) => {
        setAcademicStructure(structureData);
        setAcademicContent(contentData);
        setStudents(studentsData);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch initial data:', err);
        setLoading(false);
      });
  }, []);

  React.useEffect(() => {
    // If we have a user, and the structure is loaded, and we haven't initialized yet...
    if (currentUser && academicStructure.length > 0 && !initialized.current) {
      const userDegree = academicStructure.find(
        (d) =>
          d.type === 'degree' &&
          d.name.toLowerCase() === currentUser.degree.toLowerCase()
      );
      if (userDegree) {
        // Mark as initialized so this doesn't run again.
        initialized.current = true;

        // Set degree
        setSelectedDegree(userDegree.id);

        // Set course
        const degreeCourses = academicStructure.filter(
          (c) => c.type === 'course' && c.parentId === userDegree.id
        );
        if (degreeCourses.length > 0 && currentUser.currentCourse) {
          const course = degreeCourses.find(
            (c) => c.id === currentUser.currentCourse
          );
          if (course) {
            setSelectedCourse(course.id);
          }
        }
      }
    }
  }, [currentUser, academicStructure]);

  React.useEffect(() => {
    setSelectedSubject('');
    setShowContent(false);
  }, [selectedCourse]);

  React.useEffect(() => {
    setShowContent(false);
  }, [selectedSubject]);

  const coursesForSelectedDegree = React.useMemo(() => {
    if (!selectedDegree) return [];
    return academicStructure.filter(
      (c) => c.type === 'course' && c.parentId === selectedDegree
    );
  }, [selectedDegree, academicStructure]);

  const displayCourses = React.useMemo(() => {
    return coursesForSelectedDegree;
  }, [coursesForSelectedDegree]);

  const subjectsForSelectedCourse = React.useMemo(() => {
    if (!selectedCourse) return [];
    return academicStructure.filter(
      (s) => s.type === 'subject' && s.parentId === selectedCourse
    );
  }, [selectedCourse, academicStructure]);

  const filteredContent = React.useMemo(() => {
    if (!showContent) return [];

    const isForYou = selectedCollege === currentUser?.collegeId;

    return academicContent
      .filter((content) => {
        const degreeMatch =
          !selectedDegree || content.degreeId === selectedDegree;
        const courseMatch =
          !selectedCourse || content.courseId === selectedCourse;
        const subjectMatch =
          !selectedSubject || content.subjectId === selectedSubject;
        const contentTypeMatch =
          selectedContentType === 'all' ||
          content.contentType === selectedContentType;

        let collegeMatch = false;
        if (selectedCollege === 'all') {
          collegeMatch = !content.collegeSpecific;
        } else if (isForYou) {
          collegeMatch =
            content.collegeId === currentUser?.collegeId ||
            !content.collegeSpecific;
        } else {
          collegeMatch = content.collegeId === selectedCollege;
        }

        const searchLower = searchTerm.toLowerCase();
        const searchMatch =
          !searchTerm ||
          content.contentTitle.toLowerCase().includes(searchLower) ||
          content.description.toLowerCase().includes(searchLower);

        const myCollegeFilterMatch =
          !filterByMyCollege || content.collegeId === currentUser?.collegeId;

        return (
          searchMatch &&
          collegeMatch &&
          degreeMatch &&
          courseMatch &&
          subjectMatch &&
          contentTypeMatch &&
          myCollegeFilterMatch
        );
      })
      .map((content) => {
        const ageInHours =
          (new Date().getTime() - new Date(content.createdAt).getTime()) /
          (1000 * 60 * 60);
        const gravity = 1.8;
        let score =
          (content.likes + content.downloads * 1.5) /
          Math.pow(ageInHours + 2, gravity);

        if (
          isForYou &&
          content.collegeId === currentUser?.collegeId &&
          content.collegeSpecific
        ) {
          score *= 1.5;
        }

        return { ...content, popularityScore: score };
      })
      .sort((a, b) => b.popularityScore - a.popularityScore);
  }, [
    showContent,
    searchTerm,
    academicContent,
    selectedCollege,
    currentUser,
    selectedDegree,
    selectedCourse,
    selectedSubject,
    selectedContentType,
    filterByMyCollege,
  ]);

  const handleStudentClick = (studentId: string) => {
    const student = students[studentId];
    if (student) {
      setSelectedStudent(student);
    }
  };

  const handleCloseDialog = () => {
    setSelectedStudent(null);
  };

  const canShowButton = selectedDegree && selectedCourse && selectedSubject;

  return (
    <>
      <div className='space-y-6 p-4 md:p-6'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight md:text-3xl'>
            Academic Resources
          </h2>
          <p className='mt-2 text-muted-foreground'>
            Select your course details to find resources shared by your peers
            and seniors.
          </p>
        </div>

        <div className='space-y-4 rounded-lg border p-4'>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
            <Select
              onValueChange={(degreeId) => {
                setSelectedDegree(degreeId);
                setSelectedCourse('');
                setSelectedSubject('');
                setShowContent(false);
              }}
              value={selectedDegree}
            >
              <SelectTrigger>
                <SelectValue placeholder='Choose Your Degree' />
              </SelectTrigger>
              <SelectContent>
                {academicStructure
                  .filter((node) => node.type === 'degree')
                  .map((degree) => (
                    <SelectItem key={degree.id} value={degree.id}>
                      {degree.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>

            <Select
              onValueChange={setSelectedCourse}
              value={selectedCourse}
              disabled={!selectedDegree}
            >
              <SelectTrigger>
                <SelectValue placeholder='Select Year / Semester' />
              </SelectTrigger>
              <SelectContent>
                {displayCourses.map((course) => (
                  <SelectItem key={course.id} value={course.id}>
                    {course.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              onValueChange={setSelectedSubject}
              value={selectedSubject}
              disabled={!selectedCourse}
            >
              <SelectTrigger>
                <SelectValue placeholder='Pick a Subject' />
              </SelectTrigger>
              <SelectContent>
                {subjectsForSelectedCourse.map((subject) => (
                  <SelectItem key={subject.id} value={subject.id}>
                    {subject.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Separator />

          <div
            className={`space-y-4 transition-opacity duration-300 ${
              canShowButton ? 'opacity-100' : 'opacity-50'
            }`}
          >
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
              <Select
                onValueChange={handleCollegeChange}
                value={selectedCollege ?? 'all'}
                disabled={!canShowButton}
              >
                <SelectTrigger>
                  <SelectValue placeholder='Filter by College' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>All Colleges</SelectItem>
                  {colleges.map((college) => (
                    <SelectItem key={college.id} value={college.id}>
                      {college.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                onValueChange={setSelectedContentType}
                value={selectedContentType}
                disabled={!canShowButton}
              >
                <SelectTrigger>
                  <SelectValue placeholder='Filter by Content Type' />
                </SelectTrigger>
                <SelectContent>
                  {contentTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <div className='flex items-center gap-2'>
                        {type.icon}
                        {type.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className='flex items-center space-x-2'>
                <Checkbox
                  id='college-filter'
                  checked={filterByMyCollege}
                  onCheckedChange={(checked) =>
                    setFilterByMyCollege(checked === true)
                  }
                  disabled={!canShowButton}
                />
                <label
                  htmlFor='college-filter'
                  className='text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                >
                  Show content from my college only
                </label>
              </div>
            </div>
            <Button
              onClick={() => setShowContent(true)}
              disabled={!canShowButton}
              className='mt-4 w-full'
              size='lg'
            >
              Find Resources
            </Button>
            <div className='relative mt-4'>
              <Search className='absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-muted-foreground' />
              <Input
                placeholder='Search within results by title, description, or tags...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='pl-10 text-base'
                disabled={!canShowButton}
              />
            </div>
          </div>
        </div>

        {loading && (
          <div className='pt-12 text-center text-muted-foreground'>
            <p>Loading filters...</p>
          </div>
        )}

        {showContent &&
          (filteredContent.length > 0 ? (
            <div className='grid grid-cols-1 gap-6 pt-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
              {filteredContent.map((content) => {
                const uploader = students[content.uploaderId];
                const college = colleges.find(
                  (c) => c.id === content.collegeId
                );
                return (
                  <Card key={content.id} className='flex flex-col'>
                    <CardHeader className='p-0'>
                      <div className='relative aspect-video w-full overflow-hidden rounded-t-md'>
                        <Image
                          src={content.contentPhotoURL}
                          alt={content.contentTitle}
                          fill
                          style={{ objectFit: 'cover' }}
                        />
                      </div>
                    </CardHeader>
                    <CardContent className='flex-grow space-y-3'>
                      <CardTitle className='text-lg'>
                        {content.contentTitle}
                      </CardTitle>
                      <p className='line-clamp-2 text-sm text-muted-foreground'>
                        {content.description}
                      </p>
                    </CardContent>
                    <CardFooter className='flex flex-col items-start gap-3'>
                      <div className='flex w-full items-center justify-between text-xs text-muted-foreground'>
                        <Button
                          variant='ghost'
                          size='sm'
                          className='flex items-center gap-1 px-1'
                          onClick={() => setSelectedContentForComments(content)}
                        >
                          <MessageSquare className='h-4 w-4' />
                          {content.comments.length}
                        </Button>
                        <Button
                          variant='ghost'
                          size='sm'
                          className='flex items-center gap-1 px-1'
                          onClick={() =>
                            console.log(
                              'Like button clicked for content:',
                              content.id
                            )
                          }
                        >
                          <Heart className='h-4 w-4' />
                          {content.likes}
                        </Button>
                        <div className='flex items-center gap-1'>
                          <Download className='h-4 w-4' />
                          {content.downloads}
                        </div>
                        <div className='flex items-center gap-1'>
                          <CalendarDays className='h-4 w-4' />
                          <span>
                            {new Date(content.createdAt).toLocaleDateString(
                              'en-US',
                              {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              }
                            )}
                          </span>
                        </div>
                      </div>
                      <div className='flex w-full gap-2'>
                        <Button asChild className='flex-1'>
                          <a
                            href={content.contentURL}
                            target='_blank'
                            rel='noopener noreferrer'
                          >
                            <LinkIcon className='mr-2 h-4 w-4' />
                            View Content
                          </a>
                        </Button>
                        <Button asChild variant='outline' className='flex-1'>
                          <a
                            href={content.contentURL}
                            download={content.contentTitle}
                          >
                            <Download className='mr-2 h-4 w-4' />
                            Download
                          </a>
                        </Button>
                      </div>
                      <div className='flex w-full items-center justify-between gap-2 border-t border-gray-200 pt-2 text-xs text-muted-foreground dark:border-gray-700'>
                        <div className='flex items-center gap-2'>
                          <span className='text-sm font-semibold'>
                            Uploader:
                          </span>
                          {uploader && (
                            <div
                              className='group flex cursor-pointer items-center gap-2'
                              onClick={() => handleStudentClick(uploader.id)}
                            >
                              <Avatar className='h-6 w-6'>
                                <AvatarImage
                                  src={
                                    uploader.profileImage
                                      ? `/api/students/${uploader.id}/image`
                                      : `/api/students/placeholderDP.jpg/image`
                                  }
                                  alt={uploader.name_first}
                                />
                                <AvatarFallback>
                                  {uploader.name_first?.[0]}
                                </AvatarFallback>
                              </Avatar>
                              <span className='text-sm font-bold group-hover:underline'>
                                {uploader.name_first} {uploader.name_last}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className='flex items-center gap-2'>
                          {content.semesterTag && (
                            <Badge variant='secondary'>
                              {content.semesterTag}
                            </Badge>
                          )}
                          {college && (
                            <Badge variant='outline'>
                              {college.short_name}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className='py-12 text-center text-muted-foreground'>
              <h3 className='text-lg font-semibold'>No Resources Found</h3>
              <p>
                No academic content matches your current filters. Try a
                different selection.
              </p>
            </div>
          ))}

        {!showContent && !loading && (
          <div className='py-12 text-center text-muted-foreground'>
            <h3 className='text-lg font-semibold'>
              Begin Your Search for Knowledge
            </h3>
            <p>
              Use the filters above to select your degree, course, and subject
              to find relevant academic materials.
            </p>
          </div>
        )}
      </div>
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
      <CommentDialog
        content={selectedContentForComments}
        students={students}
        open={!!selectedContentForComments}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setSelectedContentForComments(null);
          }
        }}
      />
    </>
  );
}

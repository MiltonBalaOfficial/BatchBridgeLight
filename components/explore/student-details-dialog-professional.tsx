'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Student,
  College,
  PrivacyObject,
  PrivacyLevel,
  SeniorityFilter,
  GenderFilter,
  WorkExperienceEntry,
} from '@/lib/types';
import { Button } from '../ui/button';
import { checkPermission } from '@/lib/privacy-utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Lock,
  Mail,
  Phone,
  MessageSquare,
  Send,
  Home,
  Building,
  Info,
  Cake,
  BookUser,
  Instagram,
  Github,
  Linkedin,
  Twitter,
  Facebook,
  Link,
  Image as ImageIcon,
  Video,
  Briefcase,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface StudentDetailsDialogProps {
  student: Student | null;
  currentUser: Student | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  colleges: College[];
}

// Helper to create a human-readable string from a PrivacyObject
const getPrivacyString = (privacy: PrivacyObject): string => {
  const parts = [];

  // Level
  const levelLabels: Record<PrivacyLevel, string> = {
    public: 'Public',
    onlyMe: 'Only Me',
    allUsers: 'All Users',
    friends: 'Friends',
    closedFriends: 'Closed Friends',
    collegeBuddy: 'College Buddies',
    collegeBatchmate: 'College Batchmates',
    collegeAlumni: 'College Alumni',
    hostelBuddy: 'Hostel Buddies',
    fromMyState: 'Users from my state',
    yearMate: 'Year Mates',
    alumni: 'Alumni',
    verifiedUsers: 'Verified Users',
    admin: 'Admins',
  };
  parts.push(levelLabels[privacy.level] || 'a specific group');

  // Seniority
  if (privacy.seniority && privacy.seniority !== 'all') {
    const seniorityLabels: Record<SeniorityFilter, string> = {
      all: '', // should not be reached due to condition above
      batchmatesOnly: 'who are batchmates',
      seniorsOnly: 'who are seniors',
      juniorsOnly: 'who are juniors',
      notSeniors: 'who are not seniors',
      notJuniors: 'who are not juniors',
    };
    parts.push(seniorityLabels[privacy.seniority]);
  }

  // Gender
  if (privacy.gender && privacy.gender !== 'all') {
    const genderLabels: Record<GenderFilter, string> = {
      all: '', // should not be reached due to condition above
      sameGender: 'of the same gender',
      oppositeGender: 'of the opposite gender',
    };
    parts.push(genderLabels[privacy.gender]);
  }

  return parts.filter(Boolean).join(' ');
};

const PrivacyProtectedValue: React.FC<{
  privacy: PrivacyObject | undefined;
  currentUser: Student | null;
  targetUser: Student;
  value: React.ReactNode;
  icon?: React.ReactNode;
  label: string;
}> = ({ privacy, currentUser, targetUser, value, icon, label }) => {
  if (!privacy) {
    return null; // Or some default locked state
  }

  const hasPermission = checkPermission(privacy, currentUser, targetUser);

  if (hasPermission) {
    if (!value) return null;
    return (
      <div className='flex items-start gap-4'>
        {icon && <div className='pt-1 text-muted-foreground'>{icon}</div>}
        <div className='flex-1'>
          <p className='text-sm font-medium'>{label}</p>
          <div className='text-muted-foreground'>{value}</div>
        </div>
      </div>
    );
  }

  const privacyDescription = getPrivacyString(privacy);
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className='flex cursor-pointer items-start gap-4 text-muted-foreground'>
            {icon && <div className='pt-1'>{icon}</div>}
            <div className='flex-1'>
              <p className='text-sm font-medium'>{label}</p>
              <div className='flex items-center gap-2'>
                <Lock className='h-4 w-4' />
                <span>Visible to {privacyDescription}</span>
              </div>
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>This information is only visible to {privacyDescription}.</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

const CollapsibleDetailSection: React.FC<{
  title: string;
  children: React.ReactNode;
  icon: React.ReactNode;
  value: string;
}> = ({ title, children, icon, value }) => (
  <AccordionItem value={value}>
    <AccordionTrigger>
      <h3 className='flex items-center gap-2 text-lg font-semibold'>
        {icon} {title}
      </h3>
    </AccordionTrigger>
    <AccordionContent>
      <div className='ml-3 space-y-3 border-l-2 border-border pl-8'>
        {children}
      </div>
    </AccordionContent>
  </AccordionItem>
);

const getSocialIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case 'instagram':
      return <Instagram className='h-5 w-5' />;
    case 'github':
      return <Github className='h-5 w-5' />;
    case 'linkedin':
      return <Linkedin className='h-5 w-5' />;
    case 'twitter':
      return <Twitter className='h-5 w-5' />;
    case 'facebook':
      return <Facebook className='h-5 w-5' />;
    default:
      return <Link className='h-5 w-5' />;
  }
};

// Helper function to find the current work experience
const getCurrentWorkExperience = (
  workExperiences: WorkExperienceEntry[] | undefined
): WorkExperienceEntry | undefined => {
  if (!workExperiences || workExperiences.length === 0) {
    return undefined;
  }

  // First, look for an entry with "Present" as the 'to' date
  const presentExperience = workExperiences.find(
    (exp) => exp.to === 'Present' || !exp.to
  );
  if (presentExperience) {
    return presentExperience;
  }

  // If no "Present" entry, find the one with the latest 'from' date
  // Sort by 'from' date in descending order
  const sortedExperiences = [...workExperiences].sort((a, b) => {
    const dateA = a.from ? new Date(a.from).getTime() : 0;
    const dateB = b.from ? new Date(b.from).getTime() : 0;
    return dateB - dateA;
  });

  return sortedExperiences[0];
};

export function StudentDetailsDialog({
  student,
  currentUser,
  open,
  onOpenChange,
  colleges,
}: StudentDetailsDialogProps) {
  if (!student) {
    return null;
  }

  const studentCollege = colleges.find(
    (college) => college.id === student.collegeId
  );

  const currentWork = student.professionalInfo
    ? getCurrentWorkExperience(student.professionalInfo.workExperience)
    : undefined;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-3xl'>
        <DialogHeader>
          <div className='grid grid-cols-1 items-center gap-x-6 gap-y-4 text-center md:grid-cols-[auto,1fr] md:text-left'>
            <div className='flex w-full flex-row items-center gap-4 md:contents'>
              <Avatar className='h-24 w-24 flex-shrink-0 border-2 border-primary md:col-start-1 md:row-span-3 md:row-start-1 md:justify-self-start'>
                {checkPermission(
                  student.privacy_profileImage,
                  currentUser,
                  student
                ) ? (
                  <AvatarImage
                    src={
                      student.profileImage
                        ? `/api/students/${student.Id}/image` // Corrected to student.Id
                        : ''
                    }
                    alt={student.name_first}
                  />
                ) : (
                  <AvatarImage
                    src={`/api/students/placeholderDP.jpg/image`}
                    alt='Placeholder Profile Image'
                  />
                )}
                <AvatarFallback className='text-3xl'>
                  {`${student.name_first?.[0] || ''}${
                    student.name_last?.[0] || ''
                  }`}
                </AvatarFallback>
              </Avatar>

              <div className='flex flex-col justify-center md:col-start-2'>
                <DialogTitle className='text-xl font-bold md:text-3xl'>
                  {checkPermission(
                    student.privacy_profile,
                    currentUser,
                    student
                  )
                    ? student.professionalInfo?.ProfessionalPreNominal
                      ? `${student.professionalInfo.ProfessionalPreNominal} ${student.fullName}` // Using fullName
                      : `${student.fullName}` // Using fullName
                    : 'A BatchBridge User'}
                </DialogTitle>

                {checkPermission(
                  student.privacy_profile,
                  currentUser,
                  student
                ) && (
                  <div className='mt-1 flex flex-wrap justify-start gap-2'>
                    {student.degree && (
                      <Badge variant='outline'>{student.degree}</Badge>
                    )}
                    <Badge variant='secondary'>
                      {student.admissionYear} Admission
                    </Badge>
                    {student.collegeBatch && (
                      <Badge variant='secondary'>{student.collegeBatch}</Badge>
                    )}
                    {student.passedOut &&
                      typeof student.passedOut === 'number' && (
                        <Badge variant='secondary'>
                          Passed Out {student.passedOut}
                        </Badge>
                      )}
                  </div>
                )}
              </div>
            </div>

            {checkPermission(student.privacy_profile, currentUser, student) && (
              <DialogDescription className='text-md md:col-start-2'>
                {studentCollege?.name || 'Unknown College'}
              </DialogDescription>
            )}
          </div>
        </DialogHeader>

        <Accordion
          type='single'
          collapsible
          className='grid max-h-[60dvh] w-full gap-6 overflow-y-auto py-6 pr-4 lg:max-h-[60vh]'
        >
          {checkPermission(student.privacy_bio, currentUser, student) &&
            student.bio && (
              <CollapsibleDetailSection
                title='About'
                icon={<Info className='h-5 w-5' />}
                value='about'
              >
                <p className='text-muted-foreground italic'>"{student.bio}"</p>
              </CollapsibleDetailSection>
            )}

          {student.professionalInfo && (
            <CollapsibleDetailSection
              title='Professional Information'
              icon={<Briefcase className='h-5 w-5' />}
              value='professional'
            >
              <PrivacyProtectedValue
                privacy={student.privacy_professionalInfo}
                currentUser={currentUser}
                targetUser={student}
                value={
                  student.professionalInfo ? (
                    <div className='space-y-4'>
                      {currentWork && (
                        <>
                          <div className='flex items-start gap-4'>
                            <div className='flex-1'>
                              <p className='text-sm font-medium'>
                                Current Designation
                              </p>
                              <div className='text-muted-foreground'>
                                {currentWork.designation}
                              </div>
                            </div>
                          </div>
                          <div className='flex items-start gap-4'>
                            <div className='flex-1'>
                              <p className='text-sm font-medium'>
                                Current Workplace
                              </p>
                              <div className='text-muted-foreground'>
                                {currentWork.workplace}
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                      {student.professionalInfo.speciality && (
                        <div className='flex items-start gap-4'>
                          <div className='flex-1'>
                            <p className='text-sm font-medium'>Speciality</p>
                            <div className='text-muted-foreground'>
                              {student.professionalInfo.speciality}
                            </div>
                          </div>
                        </div>
                      )}
                      {student.professionalInfo.degrees &&
                        student.professionalInfo.degrees.length > 0 && (
                          <div>
                            <p className='text-sm font-medium'>Degrees:</p>
                            <div className='space-y-2'>
                              {student.professionalInfo.degrees.map(
                                (degree, index) => (
                                  <div key={index} className='border-l-2 pl-4'>
                                    <p className='text-sm font-medium'>
                                      {degree.degreeName}
                                    </p>
                                    <p className='text-xs text-muted-foreground'>
                                      {degree.institution}{' '}
                                      {degree.year && `(${degree.year})`}
                                    </p>
                                  </div>
                                )
                              )}
                            </div>
                          </div>
                        )}
                      {student.professionalInfo.workExperience &&
                        student.professionalInfo.workExperience.length > 0 && (
                          <div>
                            <p className='text-sm font-medium'>
                              Work Experience:
                            </p>
                            <div className='space-y-2'>
                              {student.professionalInfo.workExperience.map(
                                (exp, index) => (
                                  <div key={index} className='border-l-2 pl-4'>
                                    <p className='text-sm font-medium'>
                                      {exp.designation} at {exp.workplace}
                                    </p>
                                    <p className='text-xs text-muted-foreground'>
                                      {exp.from} - {exp.to || 'Present'}
                                    </p>
                                  </div>
                                )
                              )}
                            </div>
                          </div>
                        )}
                    </div>
                  ) : (
                    'No professional information available.'
                  )
                }
                label='Professional Information'
              />
            </CollapsibleDetailSection>
          )}

          <CollapsibleDetailSection
            title='Contact Information'
            icon={<BookUser className='h-5 w-5' />}
            value='contact'
          >
            <PrivacyProtectedValue
              privacy={student.privacy_contact_email}
              currentUser={currentUser}
              targetUser={student}
              value={student.contact_email}
              icon={<Mail className='h-5 w-5' />}
              label='Email'
            />
            <PrivacyProtectedValue
              privacy={student.privacy_contact_alt_email}
              currentUser={currentUser}
              targetUser={student}
              value={student.contact_alt_email}
              icon={<Mail className='h-5 w-5' />}
              label='Alternate Email'
            />
            <PrivacyProtectedValue
              privacy={student.privacy_contact_phone} // Corrected
              currentUser={currentUser}
              targetUser={student}
              value={student.contact_phone} // Corrected
              icon={<Phone className='h-5 w-5' />}
              label='Phone'
            />
            <PrivacyProtectedValue
              privacy={student.privacy_contact_alt_phone}
              currentUser={currentUser}
              targetUser={student}
              value={student.contact_alt_phone}
              icon={<Phone className='h-5 w-5' />}
              label='Alternate Phone'
            />
            <PrivacyProtectedValue
              privacy={student.privacy_contact_whatsapp} // Corrected
              currentUser={currentUser}
              targetUser={student}
              value={student.contact_whatsapp} // Corrected
              icon={<MessageSquare className='h-5 w-5' />}
              label='WhatsApp'
            />
            <PrivacyProtectedValue
              privacy={student.privacy_contact_telegram}
              currentUser={currentUser}
              targetUser={student}
              value={
                <a
                  href={`https://t.me/${student.contact_telegram?.replace(
                    '@',
                    ''
                  )}`}
                  target='_blank'
                  rel='noreferrer'
                  className='text-blue-500 hover:underline'
                >
                  {student.contact_telegram}
                </a>
              }
              icon={<Send className='h-5 w-5' />}
              label='Telegram'
            />
          </CollapsibleDetailSection>

          <CollapsibleDetailSection
            title='Social Media'
            icon={<Link className='h-5 w-5' />}
            value='social'
          >
            <PrivacyProtectedValue
              privacy={student.privacy_socials}
              currentUser={currentUser}
              targetUser={student}
              value={
                student.socials && student.socials.length > 0 ? (
                  <div className='space-y-2'>
                    {student.socials.map((social, index) => (
                      <div key={index} className='flex items-center gap-4'>
                        {getSocialIcon(social.type)}
                        <a
                          href={social.url}
                          target='_blank'
                          rel='noreferrer'
                          className='text-blue-500 hover:underline'
                        >
                          {social.type}: {social.url}
                        </a>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className='text-muted-foreground'>
                    No social media links available.
                  </p>
                )
              }
              icon={null}
              label='Social Media'
            />
          </CollapsibleDetailSection>

          <CollapsibleDetailSection
            title='Address'
            icon={<Home className='h-5 w-5' />}
            value='address'
          >
            <PrivacyProtectedValue
              privacy={student.privacy_currentAddress}
              currentUser={currentUser}
              targetUser={student}
              value={
                [
                  student.current_houseNo,
                  student.current_street,
                  student.current_area,
                  student.current_landmark,
                  student.current_post_office,
                  student.current_district,
                  student.current_state,
                  student.current_country,
                ]
                  .filter(Boolean)
                  .join(', ') +
                (student.current_pincode ? ` - ${student.current_pincode}` : '')
              }
              icon={<Building className='h-5 w-5' />}
              label='Current Address'
            />
            <PrivacyProtectedValue
              privacy={student.privacy_permanentAddress}
              currentUser={currentUser}
              targetUser={student}
              value={
                [
                  student.permanent_houseNo,
                  student.permanent_street,
                  student.permanent_area,
                  student.permanent_landmark,
                  student.permanent_post_office,
                  student.permanent_district,
                  student.permanent_state,
                  student.permanent_country,
                ]
                  .filter(Boolean)
                  .join(', ') +
                (student.permanent_pincode
                  ? ` - ${student.permanent_pincode}`
                  : '')
              }
              icon={<Home className='h-5 w-5' />}
              label='Permanent Address'
            />
          </CollapsibleDetailSection>

          <CollapsibleDetailSection
            title='Personal Information'
            icon={<Info className='h-5 w-5' />}
            value='personal'
          >
            <PrivacyProtectedValue
              privacy={student.privacy_birth_day}
              currentUser={currentUser}
              targetUser={student}
              value={`${student.birth_day} / ${student.birth_month}`}
              icon={<Cake className='h-5 w-5' />}
              label='Birthday'
            />
            <PrivacyProtectedValue
              privacy={student.privacy_birth_year}
              currentUser={currentUser}
              targetUser={student}
              value={student.birth_year}
              icon={<Cake className='h-5 w-5' />}
              label='Birth Year'
            />
          </CollapsibleDetailSection>

          <CollapsibleDetailSection
            title='Hostel History'
            icon={<Building className='h-5 w-5' />}
            value='hostel-history'
          >
            <PrivacyProtectedValue
              privacy={student.privacy_hostelHistory}
              currentUser={currentUser}
              targetUser={student}
              value={
                student.hostelHistory && student.hostelHistory.length > 0 ? (
                  <div className='space-y-2'>
                    {student.hostelHistory.map((entry, index) => (
                      <div key={index} className='border-l-2 pl-4'>
                        <p className='text-sm font-medium'>
                          {entry.type === 'hosteller'
                            ? `Hosteller in ${entry.building}, Room ${
                                entry.room
                              }${entry.bed ? `, Bed ${entry.bed}` : ''}`
                            : 'Day Scholar'}
                        </p>
                        <p className='text-xs text-muted-foreground'>
                          {entry.entry} - {entry.exit || 'Present'}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  'No hostel history available.'
                )
              }
              label='Hostel History'
            />
          </CollapsibleDetailSection>

          <CollapsibleDetailSection
            title='Hostel Memories'
            icon={<ImageIcon className='h-5 w-5' />}
            value='hostel-memories'
          >
            <PrivacyProtectedValue
              privacy={student.privacy_hostelMemories}
              currentUser={currentUser}
              targetUser={student}
              value={
                student.hostelMemories &&
                (student.hostelMemories.images.length > 0 ||
                  student.hostelMemories.videos.length > 0) ? (
                  <div className='space-y-2'>
                    {student.hostelMemories.images.length > 0 && (
                      <div>
                        <p className='text-sm font-medium'>Images:</p>
                        <div className='flex flex-wrap gap-2'>
                          {student.hostelMemories.images.map((image, index) => (
                            <a
                              key={index}
                              href={image}
                              target='_blank'
                              rel='noreferrer'
                              className='text-blue-500 hover:underline'
                            >
                              <ImageIcon className='mr-1 inline-block h-5 w-5' />
                              {image.split('/').pop()}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                    {student.hostelMemories.videos.length > 0 && (
                      <div>
                        <p className='text-sm font-medium'>Videos:</p>
                        <div className='flex flex-wrap gap-2'>
                          {student.hostelMemories.videos.map((video, index) => (
                            <a
                              key={index}
                              href={video}
                              target='_blank'
                              rel='noreferrer'
                              className='text-blue-500 hover:underline'
                            >
                              <Video className='mr-1 inline-block h-5 w-5' />
                              {video.split('/').pop()}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  'No hostel memories available.'
                )
              }
              label='Hostel Memories'
            />
          </CollapsibleDetailSection>
        </Accordion>

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)} variant='outline'>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

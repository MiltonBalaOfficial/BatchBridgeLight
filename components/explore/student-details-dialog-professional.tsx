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
  PrivacyObject,
  PrivacyLevel,
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
  Building,
  Info,
  Cake,
  BookUser,
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
}

// Helper to create a human-readable string from a PrivacyObject
const getPrivacyString = (privacy: PrivacyObject): string => {
  const levelLabels: Record<PrivacyLevel, string> = {
    public: 'Public',
    onlyMe: 'Only Me',
    allUsers: 'All Users',
    collegeBuddy: 'College Buddies',
    batchmate: 'Batchmates',
    batchmateandjunior: 'Batchmates and Juniors',
    batchmateandsenior: 'Batchmates and Seniors',
    senior: 'Seniors',
    junior: 'Juniors',
  };
  return levelLabels[privacy.level] || 'a specific group';
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



export function StudentDetailsDialog({
  student,
  currentUser,
  open,
  onOpenChange,
}: StudentDetailsDialogProps) {
  if (!student) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-3xl'>
        <DialogHeader>
          <div className='flex flex-col items-center gap-4 sm:flex-row sm:items-start'>
            <Avatar className='h-24 w-24 flex-shrink-0 border-2 border-primary sm:h-32 sm:w-32'>
              {checkPermission(
                student.privacy_profile_image,
                currentUser,
                student
              ) ? (
                <AvatarImage
                  src={`/api/students/${student.Id}/image`}
                  alt={student.name_first}
                />
              ) : (
                <AvatarImage
                  src={`/api/students/placeholder/image`}
                  alt='Placeholder Profile Image'
                />
              )}
              <AvatarFallback className='text-3xl'>
                {`${student.name_first?.[0] || ''}${
                  student.name_last?.[0] || ''
                }`}
              </AvatarFallback>
            </Avatar>

            <div className='flex flex-col gap-1 text-center sm:text-left'>
              <DialogTitle className='text-xl font-bold md:text-3xl'>
                {checkPermission(student.privacy_profile, currentUser, student)
                  ? student.fullName
                  : 'A BatchBridge User'}
              </DialogTitle>

              {checkPermission(
                student.privacy_profile,
                currentUser,
                student
              ) && (
                <div className='mt-2 flex flex-wrap justify-center gap-2 sm:justify-start'>
                  <Badge variant='secondary'>
                    {student.admissionYear} Admission
                  </Badge>
                  {student.passedOut &&
                    typeof student.passedOut === 'number' && (
                      <Badge variant='secondary'>
                        Passed Out {student.passedOut}
                      </Badge>
                    )}
                </div>
              )}
              {checkPermission(
                student.privacy_profile,
                currentUser,
                student
              ) && (
                <DialogDescription className='text-md'>
                  College of Medicine and JNM Hospital
                </DialogDescription>
              )}
            </div>
          </div>
        </DialogHeader>

        <Accordion
          type='single'
          collapsible
          className='grid max-h-[60dvh] w-full gap-6 overflow-y-auto py-6 pr-4 lg:max-h-[60vh]'
        >
          {student.bio && (
            <CollapsibleDetailSection
              title='About'
              icon={<Info className='h-5 w-5' />}
              value='about'
            >
              <p className='text-muted-foreground italic'>"{student.bio}"</p>
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
              privacy={student.privacy_contact_phone}
              currentUser={currentUser}
              targetUser={student}
              value={student.contact_phone}
              icon={<Phone className='h-5 w-5' />}
              label='Phone'
            />
            <PrivacyProtectedValue
              privacy={student.privacy_contact_whatsapp}
              currentUser={currentUser}
              targetUser={student}
              value={student.contact_whatsapp}
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
              privacy={student.privacy_FatherName}
              currentUser={currentUser}
              targetUser={student}
              value={student.FatherName}
              icon={<BookUser className='h-5 w-5' />}
              label="Father's Name"
            />
            <PrivacyProtectedValue
              privacy={student.privacy_roll_no}
              currentUser={currentUser}
              targetUser={student}
              value={student.roll_no}
              icon={<BookUser className='h-5 w-5' />}
              label='Roll Number'
            />
          </CollapsibleDetailSection>

          <CollapsibleDetailSection
            title='Current Hostel Room'
            icon={<Building className='h-5 w-5' />}
            value='hostel-history'
          >
            <PrivacyProtectedValue
              privacy={student.privacy_currentHostelRoom}
              currentUser={currentUser}
              targetUser={student}
              value={
                student.currentHostelRoom ? (
                  <div>
                    <p className='text-lg'>{student.currentHostelRoom}</p>
                    {student.hostelRoomUpdatedAt && (
                      <p className='text-xs text-muted-foreground'>
                        Last updated:{' '}
                        {new Date(
                          student.hostelRoomUpdatedAt
                        ).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                ) : (
                  'No hostel information available.'
                )
              }
              label='Current Hostel Room'
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

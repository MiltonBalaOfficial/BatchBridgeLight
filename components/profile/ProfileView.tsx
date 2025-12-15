'use client';

import { Student } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Mail,
  Phone,
  MessageSquare,
  Send,
  Home,
  Info,
  BookUser,
  Instagram,
  Github,
  Linkedin,
  Twitter,
  Facebook,
  Link,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { checkPermission } from '@/lib/privacy-utils';

interface ProfileViewProps {
  student: Student | null;
  currentUser: Student | null;
}

const DetailSection: React.FC<{
  title: string;
  children: React.ReactNode;
  icon: React.ReactNode;
}> = ({ title, children, icon }) => (
  <div className='space-y-4'>
    <h3 className='flex items-center gap-2 text-lg font-semibold'>
      {icon} {title}
    </h3>
    <div className='ml-3 space-y-3 border-l-2 border-border pl-8'>
      {children}
    </div>
  </div>
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

export function ProfileView({
  student,
  currentUser,
}: ProfileViewProps) {
  if (!student) {
    return (
      <div className='flex h-full items-center justify-center text-muted-foreground'>
        <p>Student not found.</p>
      </div>
    );
  }

  const isImageVisible =
    student &&
    currentUser &&
    checkPermission(student.privacy_profile_image, currentUser, student);

  return (
    <div className='container mx-auto py-8'>
      <Card>
        <CardHeader>
          <div className='flex flex-col items-center gap-6 md:flex-row md:items-start'>
            <Avatar className='h-32 w-32 flex-shrink-0 border-4 border-primary'>
              <AvatarImage
                src={
                  isImageVisible && student.profileImage
                    ? `/api/students/${student.Id}/image`
                    : `/api/students/placeholderDP.jpg/image`
                }
                alt={student.fullName}
              />
              <AvatarFallback className='text-5xl'>
                {student.name_first?.[0] || ''}
                {student.name_last?.[0] || ''}
              </AvatarFallback>
            </Avatar>

            <div className='text-center md:text-left'>
              <CardTitle className='text-4xl font-bold'>
                {student.passedOut && typeof student.passedOut === 'number'
                  ? `Dr. ${student.fullName}`
                  : `${student.fullName}`}
              </CardTitle>
              <div className='mt-2 flex flex-wrap justify-center gap-2 md:justify-start'>
                <Badge variant='secondary'>
                  {student.admissionYear} Admission
                </Badge>
                {student.passedOut && typeof student.passedOut === 'number' && (
                  <Badge variant='secondary'>
                    Passed Out {student.passedOut}
                  </Badge>
                )}
              </div>
              <p className='mt-3 text-lg text-muted-foreground'>
                College of Medicine and JNM Hospital
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className='mt-10 space-y-8'>
            {student.bio && (
              <DetailSection title='About' icon={<Info className='h-5 w-5' />}>
                <p className='text-muted-foreground italic'>"{student.bio}"</p>
              </DetailSection>
            )}

            <Separator />

            <DetailSection
              title='Contact Information'
              icon={<BookUser className='h-5 w-5' />}
            >
              {student.contact_email && (
                <div className='flex items-start gap-4'>
                  <div className='pt-1 text-muted-foreground'>
                    <Mail className='h-5 w-5' />
                  </div>
                  <div className='flex-1'>
                    <p className='text-sm font-medium'>Email</p>
                    <div className='text-muted-foreground'>
                      {student.contact_email}
                    </div>
                  </div>
                </div>
              )}
              {student.contact_phone && (
                <div className='flex items-start gap-4'>
                  <div className='pt-1 text-muted-foreground'>
                    <Phone className='h-5 w-5' />
                  </div>
                  <div className='flex-1'>
                    <p className='text-sm font-medium'>Phone</p>
                    <div className='text-muted-foreground'>
                      {student.contact_phone}
                    </div>
                  </div>
                </div>
              )}
              {student.contact_whatsapp && (
                <div className='flex items-start gap-4'>
                  <div className='pt-1 text-muted-foreground'>
                    <MessageSquare className='h-5 w-5' />
                  </div>
                  <div className='flex-1'>
                    <p className='text-sm font-medium'>WhatsApp</p>
                    <div className='text-muted-foreground'>
                      {student.contact_whatsapp}
                    </div>
                  </div>
                </div>
              )}
              {student.contact_telegram && (
                <div className='flex items-start gap-4'>
                  <div className='pt-1 text-muted-foreground'>
                    <Send className='h-5 w-5' />
                  </div>
                  <div className='flex-1'>
                    <p className='text-sm font--medium'>Telegram</p>
                    <div className='text-blue-500 hover:underline'>
                      {student.contact_telegram}
                    </div>
                  </div>
                </div>
              )}
            </DetailSection>

            <Separator />

            {student.socials && student.socials.length > 0 && (
              <DetailSection
                title='Social Media'
                icon={<Link className='h-5 w-5' />}
              >
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
              </DetailSection>
            )}

            <Separator />

            {student.fullAddress && (
              <DetailSection
                title='Address'
                icon={<Home className='h-5 w-5' />}
              >
                <div className='flex items-start gap-4'>
                  <div className='pt-1 text-muted-foreground'>
                    <Home className='h-5 w-5' />
                  </div>
                  <div className='flex-1'>
                    <p className='text-sm font-medium'>Full Address</p>
                    <div className='text-muted-foreground'>
                      {student.fullAddress}
                    </div>
                  </div>
                </div>
              </DetailSection>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

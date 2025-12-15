'use client';

import { Student, College } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Github,
  Linkedin,
  Twitter,
  Instagram,
  Globe,
  Link as LinkIcon,
  User, // Added User icon
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image'; // Added Image import

interface ExternalContributor {
  type: 'external';
  name: string;
  role: string;
  imageUrl: string;
  bio: string;
  website?: string;
  socials?: { type: string; url: string }[];
}

export type MergedContributor =
  | (Student & { studentId: string; role: string; type: 'student' })
  | ExternalContributor;

const getSocialIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case 'github':
      return <Github className='h-5 w-5' />;
    case 'linkedin':
      return <Linkedin className='h-5 w-5' />;
    case 'twitter':
      return <Twitter className='h-5 w-5' />;
    case 'instagram':
      return <Instagram className='h-5 w-5' />;
    case 'website':
      return <Globe className='h-5 w-5' />;
    default:
      return <LinkIcon className='h-5 w-5' />;
  }
};

export const ContributorCard = ({
  person,
  onClick,
  colleges,
}: {
  person: MergedContributor;
  onClick: () => void;
  colleges: College[];
}) => {
  const isStudent = person.type === 'student';
  const name = isStudent
    ? `${person.name_first} ${person.name_last}`
    : person.name;
  const imageUrl = isStudent
    ? person.profileImage
      ? `/api/students/${(person as Student).Id}/image` // Corrected to person.Id
      : ''
    : person.imageUrl;
  const socials = person.socials || [];
  const website = 'website' in person ? person.website : undefined;

  const studentCollege = isStudent
    ? colleges.find((college) => college.id === person.collegeId)
    : undefined;

  return (
    <Card
      className='cursor-pointer transition-shadow hover:shadow-lg'
      onClick={onClick}
    >
      <CardHeader>
        <div className='relative mx-auto aspect-square w-full max-w-[160px] overflow-hidden rounded-full'>
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={name}
              fill
              style={{ objectFit: 'cover' }}
            />
          ) : (
            <div className='flex h-full w-full items-center justify-center bg-muted'>
              <User className='h-16 w-16 text-muted-foreground' />
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className='text-center'>
        <CardTitle>{name}</CardTitle>
        <p className='text-md font-semibold text-primary'>{person.role}</p>
        {isStudent && (
          <p className='text-sm text-muted-foreground'>
            {person.collegeBatch}{' '}
            {studentCollege ? `(${studentCollege.short_name})` : ''}
          </p>
        )}
        {'type' in person && person.type === 'external' && person.bio && (
          <p className='mt-2 text-sm text-muted-foreground'>{person.bio}</p>
        )}
        <div className='mt-4 flex justify-center gap-4'>
          {socials.map((social, index) => (
            <Link
              href={social.url}
              key={index}
              target='_blank'
              rel='noopener noreferrer'
              className='text-muted-foreground hover:text-foreground'
              onClick={(e) => e.stopPropagation()} // Prevent card click when clicking social icon
            >
              {getSocialIcon(social.type)}
            </Link>
          ))}
          {website && (
            <Link
              href={website}
              target='_blank'
              rel='noopener noreferrer'
              className='text-muted-foreground hover:text-foreground'
              onClick={(e) => e.stopPropagation()}
            >
              {getSocialIcon('website')}
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

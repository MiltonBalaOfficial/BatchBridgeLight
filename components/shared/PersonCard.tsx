'use client';

import { TeamMember, Patron } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import {
  Github,
  Linkedin,
  Twitter,
  Instagram,
  Globe,
  Link as LinkIcon,
} from 'lucide-react';
import Link from 'next/link';

type PersonData = TeamMember | Patron;

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

interface PersonCardProps {
  person: PersonData;
}

export const PersonCard: React.FC<PersonCardProps> = ({ person }) => {
  const { name, role, description, image, socials } = person;

  return (
    <Card className='flex h-[330px] flex-col overflow-hidden'>
      {' '}
      {/* Fixed height for the card, hide overflow */}
      <CardHeader className='flex h-[120px] flex-shrink-0 items-center justify-center'>
        {' '}
        {/* Fixed height for image container */}
        <div className='relative aspect-square w-[100px] overflow-hidden rounded-full'>
          {' '}
          {/* DP size */}
          {image ? (
            <Image src={image} alt={name} fill style={{ objectFit: 'cover' }} />
          ) : (
            <div className='flex h-full w-full items-center justify-center bg-muted'>
              <LinkIcon className='h-12 w-12 text-muted-foreground' />{' '}
              {/* Using LinkIcon as a generic fallback */}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className='flex h-[180px] flex-grow flex-col items-center justify-between px-4 pb-4'>
        {' '}
        {/* Center align text, fixed height, justify-between */}
        <div className='flex flex-grow flex-col items-center text-center'>
          {' '}
          {/* Group top content, ensure text-center, flex-grow to take space */}
          <CardTitle className='mb-1 line-clamp-1 h-[28px] text-lg'>
            {name}
          </CardTitle>{' '}
          {/* Line clamp and fixed height */}
          <p className='mb-2 line-clamp-1 h-[20px] text-sm font-semibold text-primary'>
            {role}
          </p>{' '}
          {/* Line clamp and fixed height */}
          {description && (
            <p className='mt-2 line-clamp-3 overflow-hidden text-xs text-muted-foreground'>
              {' '}
              {/* Fixed height removed, relies on line-clamp and overflow */}
              {description}
            </p>
          )}
        </div>
        {socials && socials.length > 0 && (
          <div className='mt-3 flex h-[24px] w-full flex-shrink-0 justify-center gap-3'>
            {' '}
            {/* Fixed height for social links */}
            {socials.map((social, index) => (
              <Link
                href={social.url}
                key={index}
                target='_blank'
                rel='noopener noreferrer'
                className='text-muted-foreground hover:text-foreground'
              >
                {getSocialIcon(social.type)}
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

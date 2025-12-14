'use client';

import {
  ArrowLeft,
  Save,
  User,
  Phone,
  Link,
  Home,
  Building,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface FormHeaderProps {
  onSave: () => void;
  onBack: () => void;
  isSaving: boolean; // To show a saving indicator on the button
}

const formSections = [
  {
    id: 'basic-info',
    label: 'Basic Information',
    icon: <User className='h-5 w-5' />,
  },
  {
    id: 'contact-info',
    label: 'Contact Information',
    icon: <Phone className='h-5 w-5' />,
  },
  { id: 'socials', label: 'Socials', icon: <Link className='h-5 w-5' /> },
  { id: 'address', label: 'Address', icon: <Home className='h-5 w-5' /> },
  {
    id: 'profile-details',
    label: 'Profile Details',
    icon: <User className='h-5 w-5' />,
  },
  {
    id: 'hostel-info',
    label: 'Hostel Information',
    icon: <Building className='h-5 w-5' />,
  },
];

const scrollToSection = (id: string) => {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};

export const FormHeader = ({ onSave, onBack, isSaving }: FormHeaderProps) => {
  return (
    <div className='sticky top-0 z-50 mb-6 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
      <div className='container flex h-16 items-center justify-between border-b'>
        <div className='flex items-center gap-4'>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant='outline' size='icon' onClick={onBack}>
                  <ArrowLeft className='h-4 w-4' />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Back to Students List</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <h2 className='text-lg font-semibold'>Edit Student Profile</h2>
        </div>

        <div className='flex items-center gap-2'>
          {formSections.map((section) => (
            <TooltipProvider key={section.id}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant='ghost'
                    size='icon'
                    onClick={() => scrollToSection(section.id)}
                  >
                    {section.icon}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Go to {section.label}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>

        <Button onClick={onSave} disabled={isSaving}>
          <Save className='mr-2 h-4 w-4' />
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </div>
  );
};

'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';

export type PrivacyFilterLight =
  | 'all'
  | 'onlyMe'
  | 'batchMates'
  | 'collegeBuddy'
  | 'onlySeniors'
  | 'onlyJuniors'
  | 'batchmatesAndSeniors'
  | 'batchmatesAndJuniors';

const filterOptions: { value: PrivacyFilterLight; label: string }[] = [
  { value: 'all', label: 'All Members' },
  { value: 'onlyMe', label: 'Only Me' },
  { value: 'batchMates', label: 'Batchmates' },
  { value: 'collegeBuddy', label: 'College Buddies' },
  { value: 'onlySeniors', label: 'Seniors' },
  { value: 'onlyJuniors', label: 'Juniors' },
  { value: 'batchmatesAndSeniors', label: 'Batchmates & Seniors' },
  { value: 'batchmatesAndJuniors', label: 'Batchmates & Juniors' },
];

interface PrivacyFilterControlProps {
  value: PrivacyFilterLight;
  onChange: (value: PrivacyFilterLight) => void;
  className?: string;
}

export function PrivacyFilterControl({
  value,
  onChange,
  className,
}: PrivacyFilterControlProps) {
  return (
    <div className={className}>
      <Label htmlFor='privacy-filter' className='px-4 pb-2 text-sm font-medium'>
        Filter by Relationship
      </Label>
      <div className='px-4'>
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger id='privacy-filter'>
            <SelectValue placeholder='Select a filter...' />
          </SelectTrigger>
          <SelectContent>
            {filterOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

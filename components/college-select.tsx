'use client';

import * as React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { College } from '@/lib/types';

type CollegeSelectProps = {
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
};

export function CollegeSelect({
  value,
  onChange,
  className,
}: CollegeSelectProps) {
  const [colleges, setColleges] = React.useState<
    { value: string; label: string }[]
  >([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchColleges = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/colleges');
        const data: College[] = await response.json();
        const formattedColleges = data.map((college) => ({
          value: college.id,
          label: college.name,
        }));
        setColleges(formattedColleges);
      } catch (error) {
        console.error('Failed to fetch colleges', error);
      } finally {
        setLoading(false);
      }
    };

    fetchColleges();
  }, []);

  const handleChange = (val: string) => {
    onChange?.(val);
  };

  return (
    <div className={className}>
      <label className='mb-1 block text-sm font-medium'>College</label>
      <Select
        value={value || ''}
        onValueChange={handleChange}
        disabled={loading}
      >
        <SelectTrigger className='w-full'>
          <SelectValue placeholder='Select a college' />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='all'>All Colleges</SelectItem>
          {colleges.map((c) => (
            <SelectItem key={c.value} value={c.value}>
              {c.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

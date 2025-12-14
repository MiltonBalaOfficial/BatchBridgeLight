'use client';

import * as React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Batch {
  value: string;
  label: string;
}

type BatchSelectProps = {
  value?: string | null;
  onChange?: (value: string) => void;
  className?: string;
  batches?: Batch[];
  loading?: boolean;
};

export function BatchSelect({
  value,
  onChange,
  className,
  batches = [],
  loading = false,
}: BatchSelectProps) {
  const handleChange = (val: string) => {
    onChange?.(val);
  };

  return (
    <div className={className}>
      <label className='-mt-2 mb-1 block text-sm font-medium'>Batch</label>
      <Select
        value={value || ''}
        onValueChange={handleChange}
        disabled={loading || batches.length === 0}
      >
        <SelectTrigger className='w-full'>
          <SelectValue
            placeholder={
              loading
                ? 'Loading...'
                : batches.length
                  ? 'Select a batch'
                  : 'No batches available'
            }
          />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='all'>All Batches</SelectItem>
          {batches.map((b) => (
            <SelectItem key={b.value} value={b.value}>
              {b.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { College } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from 'next/navigation';

interface CollegeFormProps {
  college?: College;
  isNew?: boolean;
}

export const CollegeForm = ({ college, isNew = false }: CollegeFormProps) => {
  const [formData, setFormData] = useState<Partial<College>>(college || {});
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = isNew ? '/api/colleges' : `/api/colleges/${college?.id}`;
    const method = isNew ? 'POST' : 'PUT';

    const dataToSave = {
      ...formData,
      id: isNew ? uuidv4() : college?.id,
      updated_at: new Date().toISOString(),
    };

    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dataToSave),
    });

    if (response.ok) {
      router.push('/admin/colleges');
      router.refresh(); // to see the changes
    } else {
      // Handle error
      console.error('Failed to save college');
    }
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-6'>
      <div>
        <Label htmlFor='name'>College Name</Label>
        <Input
          id='name'
          name='name'
          value={formData.name || ''}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label htmlFor='short_name'>Short Name</Label>
        <Input
          id='short_name'
          name='short_name'
          value={formData.short_name || ''}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label htmlFor='location'>Location</Label>
        <Input
          id='location'
          name='location'
          value={formData.location || ''}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label htmlFor='state'>State</Label>
        <Input
          id='state'
          name='state'
          value={formData.state || ''}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label htmlFor='established_year'>Established Year</Label>
        <Input
          id='established_year'
          name='established_year'
          type='number'
          value={formData.established_year || ''}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label htmlFor='type'>Type</Label>
        <Input
          id='type'
          name='type'
          value={formData.type || ''}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label htmlFor='website'>Website</Label>
        <Input
          id='website'
          name='website'
          value={formData.website || ''}
          onChange={handleChange}
        />
      </div>
      <div className='flex justify-end'>
        <Button type='submit'>
          {isNew ? 'Create College' : 'Save Changes'}
        </Button>
      </div>
    </form>
  );
};

'use client';

import { Marketplace } from '@/components/explore/marketplace/Marketplace';
import { College, Student } from '@/lib/types';
import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

export default function MarketplacePage() {
  const [colleges, setColleges] = useState<College[]>([]);
  const [currentUser, setCurrentUser] = useState<Student | null>(null);
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [collegesRes, userRes] = await Promise.all([
          fetch('/api/colleges'),
          fetch('/api/user'),
        ]);
        const [collegesData, userData]: [
          College[],
          Student | { role: 'guest' },
        ] = await Promise.all([collegesRes.json(), userRes.json()]);
        setColleges(collegesData);
        if (user && userData.role !== 'guest') {
          setCurrentUser(userData as Student);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [user]);

  const handleSellerClick = (student: Student) => {
    router.push(`/profile/${student.id}`);
  };

  return (
    <div className='p-4 sm:p-6'>
      <div className='mb-6'>
        <h1 className='text-3xl font-bold'>Marketplace</h1>
        <p className='text-muted-foreground'>
          Buy and sell items from fellow students.
        </p>
      </div>
      <Marketplace
        colleges={colleges}
        currentUser={currentUser}
        onSellerClick={handleSellerClick}
      />
    </div>
  );
}

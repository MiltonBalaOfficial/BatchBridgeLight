'use client';

import { useEffect, useState } from 'react';
import { ContributorCard, MergedContributor } from './ContributorCard';

interface ExternalContributor {
  type: 'external';
  name: string;
  role: string;
  imageUrl: string;
  bio: string;
  website?: string;
  socials?: { type: string; url: string }[];
}

export function PatronsSection() {
  const [patrons, setPatrons] = useState<ExternalContributor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/patrons')
      .then((res) => res.json())
      .then((data: ExternalContributor[]) => {
        setPatrons(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching patrons data:', error);
        setLoading(false);
      });
  }, []);

  const handleCardClick = (person: ExternalContributor) => {
    if (person.website) {
      window.open(person.website, '_blank');
    }
  };

  if (loading || patrons.length === 0) {
    return null; // Don't show anything while loading or if there are no patrons
  }

  return (
    <div className='mt-16'>
      <div className='container mx-auto px-4 text-center'>
        <h3 className='text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-slate-100'>
          Our Valued Patrons
        </h3>
        <p className='mx-auto mt-2 max-w-2xl text-lg text-slate-600 dark:text-slate-300'>
          This project is made possible by the generous support of our patrons.
        </p>
      </div>
      <div className='container mx-auto mt-8 px-4'>
        <div className='grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
          {patrons.map((person) => (
            <ContributorCard
              key={person.name}
              person={person as MergedContributor}
              onClick={() => handleCardClick(person)}
              colleges={[]} // External contributors don't need college data
            />
          ))}
        </div>
      </div>
    </div>
  );
}

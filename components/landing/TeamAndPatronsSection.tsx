'use client';

import { TeamMember, Patron } from '@/lib/types';
import { PersonCard } from '@/components/shared/PersonCard';
import teamPatronData from '@/data/teamPatronData.json';

export function TeamAndPatronsSection() {
  const team: TeamMember[] = teamPatronData.team;
  const patrons: Patron[] = teamPatronData.patrons;

  const allPersonnel = [...team, ...patrons];

  if (allPersonnel.length === 0) {
    return null; // Don't show anything if there are no personnel
  }

  return (
    <section className='pt-12 pb-12'>
      <div className='container mx-auto px-4 text-center'>
        <h2 className='text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-slate-100'>
          Meet the Team & Patrons
        </h2>
        <p className='mx-auto mt-4 max-w-3xl text-lg text-slate-600 dark:text-slate-300'>
          The individuals and organizations behind BatchBridge.
        </p>

        <div className='mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
          {allPersonnel.map((person) => (
            <PersonCard key={person.id} person={person} />
          ))}
        </div>
      </div>
    </section>
  );
}

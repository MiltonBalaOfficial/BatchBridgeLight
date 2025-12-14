'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AcademicContentOverviewPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the new Academic Content Manager page
    router.replace('/admin/academic-content-manager');
  }, [router]);

  return (
    <div className='flex h-full items-center justify-center'>
      <p className='text-muted-foreground'>
        Redirecting to Academic Content Manager...
      </p>
    </div>
  );
}

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function StudentGridSkeleton() {
  return (
    <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
      {Array.from({ length: 8 }).map((_, index) => (
        <Card key={index}>
          <CardHeader>
            <Skeleton className='mx-auto h-40 w-40 rounded-full' />
          </CardHeader>
          <CardContent className='space-y-2 text-center'>
            <Skeleton className='mx-auto h-6 w-3/4' />
            <Skeleton className='mx-auto h-4 w-1/2' />
            <Skeleton className='mx-auto h-4 w-2/3' />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

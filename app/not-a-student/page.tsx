import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function NotAStudentPage() {
  return (
    <div className='flex h-screen flex-col items-center justify-center p-4 text-center'>
      <h1 className='text-2xl font-bold text-destructive'>Access Denied</h1>
      <p className='mt-4 text-lg text-muted-foreground'>
        The account you are signed in with is not registered in our student
        database.
      </p>
      <p className='mt-2 text-sm text-muted-foreground'>
        Please try a different account, or if you believe this is an error,
        contact the administration.
      </p>
      <div className='mt-6 flex gap-4'>
        <Link href='/' passHref>
          <Button>Home Page</Button>
        </Link>
        <Link href='/' passHref>
          <Button variant='outline'>Sign in with a Different Account</Button>
        </Link>
      </div>
    </div>
  );
}

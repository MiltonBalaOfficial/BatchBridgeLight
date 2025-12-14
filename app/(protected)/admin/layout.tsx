import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();

  const adminEmail = 'mltnbla@gmail.com';
  const userEmail = user?.emailAddresses[0]?.emailAddress;

  if (userEmail !== adminEmail) {
    redirect('/');
  }

  return <>{children}</>;
}

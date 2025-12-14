import { SignIn } from '@clerk/nextjs';

function page() {
  return (
    <div>
      <SignIn />
    </div>
  );
}

export default page;

export function generateStaticParams() {
  return [];
}

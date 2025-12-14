import Image from 'next/image';
import { cn } from '@/lib/utils';

interface LogoProps {
  showTagline?: boolean;
  className?: string;
  iconSize?: number;
}

const Logo = ({ showTagline = true, className, iconSize = 36 }: LogoProps) => {
  return (
    <div className={cn('flex items-center space-x-2', className)}>
      <Image
        src='/logo.png'
        alt='BatchBridge Logo'
        width={iconSize}
        height={iconSize}
      />
      <div className='flex flex-col'>
        <span className='text-xl font-bold text-white'>BatchBridge</span>
        {showTagline && (
          <p className='-mt-1 ml-4 text-xs text-indigo-100 dark:text-indigo-200'>
            — Bridging Batches, Building Bonds
          </p>
        )}
      </div>
    </div>
  );
};

export default Logo;

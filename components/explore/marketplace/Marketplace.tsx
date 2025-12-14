'use client';

import { useEffect, useState } from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Student, College, MarketplaceItem } from '@/lib/types';
import { MarketplaceItemDetailsDialog } from './MarketplaceItemDetailsDialog';

interface MarketplaceProps {
  onSellerClick: (student: Student) => void;
  currentUser: Student | null;
  colleges: College[];
}

export function Marketplace({ onSellerClick }: MarketplaceProps) {
  const [items, setItems] = useState<MarketplaceItem[]>([]);
  const [students, setStudents] = useState<{ [id: string]: Student }>({});
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<MarketplaceItem | null>(
    null
  );
  const [selectedSeller, setSelectedSeller] = useState<Student | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch('/api/marketplace').then((res) => res.json()),
      fetch('/api/students').then((res) => res.json()),
    ])
      .then(
        ([marketplaceData, studentsData]: [MarketplaceItem[], Student[]]) => {
          setItems(marketplaceData);
          // The API returns an array, but the component expects an object
          // Let's convert it back to an object for minimal code change
          const studentsObject = studentsData.reduce(
            (acc, student) => {
              acc[student.id] = student;
              return acc;
            },
            {} as { [key: string]: Student }
          );
          setStudents(studentsObject);
          setLoading(false);
        }
      )
      .catch((error) => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  }, []);

  const handleItemClick = (item: MarketplaceItem) => {
    const seller = students[item.sellerId] || null;
    setSelectedItem(item);
    setSelectedSeller(seller);
    setIsDialogOpen(true);
  };

  if (loading) {
    return (
      <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
        {Array.from({ length: 8 }).map((_, index) => (
          <Card key={index} className='overflow-hidden'>
            <CardHeader className='p-0'>
              <div className='aspect-h-9 aspect-w-16 bg-muted'></div>
            </CardHeader>
            <CardContent className='p-4'>
              <div className='h-4 w-3/4 rounded bg-muted'></div>
              <div className='mt-2 h-4 w-1/2 rounded bg-muted'></div>
              <div className='mt-4 h-8 w-1/4 rounded bg-muted'></div>
            </CardContent>
            <CardFooter className='flex justify-between p-4'></CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <>
      <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
        {items.map((item) => (
          <Card
            key={item.id}
            onClick={() => handleItemClick(item)}
            className='group flex cursor-pointer flex-col overflow-hidden transition-shadow hover:shadow-lg'
          >
            <CardHeader className='relative p-0'>
              <Badge
                variant='secondary'
                className='absolute top-2 right-2 z-10'
              >
                {item.category}
              </Badge>
              <div className='aspect-h-9 aspect-w-16 relative'>
                <Image
                  src={item.thumbnailUrl}
                  alt={item.itemName}
                  fill
                  style={{ objectFit: 'cover' }}
                  className='transition-transform duration-300 ease-in-out group-hover:scale-105'
                  unoptimized // Using unoptimized because the images are local
                />
              </div>
            </CardHeader>
            <CardContent className='flex-grow p-4'>
              <h3 className='text-lg font-semibold'>{item.itemName}</h3>

              <div className='mt-4'>
                <p className='text-2xl font-bold'>
                  ₹{item.price.toLocaleString('en-IN')}
                </p>
              </div>
            </CardContent>
            <CardFooter className='flex flex-col items-start gap-4 p-4'>
              <div className='flex w-full items-center justify-between'>
                <div className='flex items-center gap-2'>
                  <Avatar className='h-8 w-8'>
                    <AvatarImage
                      src={item.sellerAvatar}
                      alt={item.sellerName}
                    />
                    <AvatarFallback>{item.sellerName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className='text-sm font-semibold'>{item.sellerName}</p>
                    <p className='text-xs text-muted-foreground'>
                      Posted on {new Date(item.postedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
      <MarketplaceItemDetailsDialog
        item={selectedItem}
        seller={selectedSeller}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSellerClick={onSellerClick}
      />
    </>
  );
}

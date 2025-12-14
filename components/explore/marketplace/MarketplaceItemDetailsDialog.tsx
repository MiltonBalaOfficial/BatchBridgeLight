'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Student } from '@/lib/types';
import { Button } from '../../ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import Image from 'next/image';
import { MessageSquare, ArrowRight, X } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface MarketplaceItem {
  id: string;
  sellerId: string;
  sellerName: string;
  sellerAvatar: string;
  itemName: string;
  category: string;
  price: number;
  description: string;
  thumbnailUrl: string;
  images: string[];
  postedAt: string;
  faqs: { question: string; answer: string }[];
}

interface MarketplaceItemDetailsDialogProps {
  item: MarketplaceItem | null;
  seller: Student | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSellerClick?: (student: Student) => void;
}

export function MarketplaceItemDetailsDialog({
  item,
  seller,
  open,
  onOpenChange,
  onSellerClick,
}: MarketplaceItemDetailsDialogProps) {
  if (!item) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-3xl p-0'>
        <div className='flex h-full max-h-[90dvh] flex-col'>
          <DialogHeader className='flex-shrink-0 p-6 pb-4'>
            <DialogTitle className='text-2xl font-bold'>
              {item.itemName}
            </DialogTitle>
            <DialogDescription className='flex items-center gap-2'>
              <Badge variant='secondary'>{item.category}</Badge>
              <span className='text-sm text-muted-foreground'>
                Posted on {new Date(item.postedAt).toLocaleDateString()}
              </span>
            </DialogDescription>
          </DialogHeader>

          <div className='flex-1 overflow-y-auto px-6'>
            <div className='mb-6'>
              <Carousel className='-mx-6' opts={{ align: 'start' }}>
                <CarouselContent>
                  {item.images.map((image, index) => (
                    <CarouselItem key={index}>
                      <div className='relative aspect-video w-full'>
                        <Image
                          src={image}
                          alt={`${item.itemName} - image ${index + 1}`}
                          fill
                          style={{ objectFit: 'contain' }}
                          unoptimized
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className='left-8' />
                <CarouselNext className='right-8' />
              </Carousel>
            </div>

            <div className='space-y-6'>
              <div>
                <h3 className='text-lg font-medium'>Price</h3>
                <p className='mt-1 text-4xl font-extrabold'>
                  ₹{item.price.toLocaleString('en-IN')}
                </p>
              </div>

              <Separator />

              <div>
                <h3 className='text-lg font-medium'>Description</h3>
                <p className='mt-2 whitespace-pre-wrap text-muted-foreground'>
                  {item.description}
                </p>
              </div>

              {item.faqs && item.faqs.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <h3 className='text-lg font-medium'>
                      Frequently Asked Questions
                    </h3>
                    <Accordion
                      type='single'
                      collapsible
                      className='mt-2 w-full'
                    >
                      {item.faqs.map((faq, index) => (
                        <AccordionItem key={index} value={`item-${index}`}>
                          <AccordionTrigger>{faq.question}</AccordionTrigger>
                          <AccordionContent>{faq.answer}</AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </div>
                </>
              )}

              {seller && (
                <>
                  <Separator />
                  <div>
                    <h3 className='text-lg font-medium'>About the Seller</h3>
                    <div
                      className='mt-4 flex cursor-pointer items-center justify-between rounded-lg bg-muted/50 p-4 transition-colors hover:bg-muted'
                      onClick={() => onSellerClick?.(seller)}
                    >
                      <div className='flex items-center gap-4'>
                        <Avatar className='h-14 w-14'>
                          <AvatarImage
                            src={seller.profileImage || ''}
                            alt={seller.name_first}
                          />
                          <AvatarFallback>
                            {seller.name_first?.[0]}
                            {seller.name_last?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className='text-lg font-semibold'>
                            {seller.name_first} {seller.name_last}
                          </p>
                          <p className='text-sm text-muted-foreground'>
                            {seller.collegeBatch}
                          </p>
                        </div>
                      </div>
                      <Button variant='ghost' size='icon'>
                        <ArrowRight className='h-5 w-5' />
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          <DialogFooter className='flex-shrink-0 border-t bg-background p-6'>
            <Button size='lg' className='w-full sm:w-auto'>
              <MessageSquare className='mr-2 h-5 w-5' />
              Contact Seller
            </Button>
          </DialogFooter>
        </div>
        <button
          onClick={() => onOpenChange(false)}
          className='absolute top-4 right-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-none disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground'
        >
          <X className='h-4 w-4' />
          <span className='sr-only'>Close</span>
        </button>
      </DialogContent>
    </Dialog>
  );
}

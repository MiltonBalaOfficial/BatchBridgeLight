'use client';

import { useEffect, useState } from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, Share2 } from 'lucide-react';
import Image from 'next/image';

interface FeedComment {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  timestamp: string;
  content: string;
}

interface FeedMedia {
  type: 'image' | 'video';
  url: string;
}

interface FeedItem {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  timestamp: string;
  content: string;
  media: FeedMedia[];
  likes: number;
  comments: FeedComment[];
}

export function Feed() {
  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/feed')
      .then((res) => res.json())
      .then((data) => {
        setFeedItems(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching feed:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading feed...</div>;
  }

  return (
    <div className='mx-auto max-w-2xl space-y-4'>
      {feedItems.map((item) => (
        <Card key={item.id}>
          <CardHeader className='flex flex-row items-center gap-4'>
            <Avatar>
              <AvatarImage src={item.authorAvatar} alt={item.authorName} />
              <AvatarFallback>{item.authorName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className='font-semibold'>{item.authorName}</p>
              <p className='text-sm text-muted-foreground'>
                {new Date(item.timestamp).toLocaleString()}
              </p>
            </div>
          </CardHeader>
          <CardContent>
            <p className='mb-4 whitespace-pre-wrap'>{item.content}</p>
            {item.media.length > 0 && (
              <div className='relative mb-4 h-64 w-full'>
                {item.media[0].type === 'image' && (
                  <Image
                    src={item.media[0].url}
                    alt='Feed media'
                    fill
                    style={{ objectFit: 'cover' }}
                    className='rounded-md'
                  />
                )}
              </div>
            )}
          </CardContent>
          <CardFooter className='flex justify-between'>
            <Button variant='ghost' size='sm'>
              <Heart className='mr-2 h-4 w-4' /> {item.likes}
            </Button>
            <Button variant='ghost' size='sm'>
              <MessageCircle className='mr-2 h-4 w-4' /> {item.comments.length}
            </Button>
            <Button variant='ghost' size='sm'>
              <Share2 className='mr-2 h-4 w-4' /> Share
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

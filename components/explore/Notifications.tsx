'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import {
  MessageSquare,
  Heart,
  UserPlus,
  Megaphone,
  Star,
  Mail,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';

interface NotificationSender {
  id: string;
  name: string;
  avatar: string;
}

interface Notification {
  id: string;
  type:
    | 'new_message'
    | 'story_of_the_day'
    | 'post_like'
    | 'new_comment'
    | 'friend_request'
    | 'system_announcement';
  isRead: boolean;
  timestamp: string;
  sender?: NotificationSender;
  title?: string;
  content: string;
  link: string;
}

const getNotificationIcon = (type: Notification['type']) => {
  switch (type) {
    case 'new_message':
      return <Mail className='h-6 w-6 text-blue-500' />;
    case 'story_of_the_day':
      return <Star className='h-6 w-6 text-yellow-500' />;
    case 'post_like':
      return <Heart className='h-6 w-6 text-red-500' />;
    case 'new_comment':
      return <MessageSquare className='h-6 w-6 text-green-500' />;
    case 'friend_request':
      return <UserPlus className='h-6 w-6 text-purple-500' />;
    case 'system_announcement':
      return <Megaphone className='h-6 w-6 text-indigo-500' />;
    default:
      return null;
  }
};

export function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/notifications')
      .then((res) => res.json())
      .then((data: Notification[]) => {
        setNotifications(
          data.sort(
            (a, b) =>
              new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          )
        );
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching notifications:', error);
        setLoading(false);
      });
  }, []);

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notif) => ({ ...notif, isRead: true }))
    );
  };

  if (loading) {
    return <div>Loading notifications...</div>;
  }

  return (
    <div className='mx-auto max-w-3xl'>
      <div className='mb-4 flex items-center justify-between'>
        <h1 className='text-2xl font-bold'>Notifications</h1>
        <Button variant='outline' size='sm' onClick={markAllAsRead}>
          Mark all as read
        </Button>
      </div>
      <div className='space-y-3'>
        {notifications.map((notif) => (
          <Link href={notif.link} key={notif.id} passHref>
            <Card
              className={cn(
                'cursor-pointer transition-colors hover:bg-muted/50',
                !notif.isRead && 'border-primary/50 bg-muted/20'
              )}
              onClick={() => markAsRead(notif.id)}
            >
              <CardContent className='flex items-start gap-4 p-4'>
                <div className='mt-1 flex-shrink-0'>
                  {getNotificationIcon(notif.type)}
                </div>
                <div className='flex-1'>
                  <div className='flex items-center gap-2'>
                    {notif.sender && (
                      <Avatar className='h-8 w-8'>
                        <AvatarImage
                          src={notif.sender.avatar}
                          alt={notif.sender.name}
                        />
                        <AvatarFallback>
                          {notif.sender.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <p className='text-sm'>
                      {notif.sender && (
                        <span className='font-semibold'>
                          {notif.sender.name}
                        </span>
                      )}{' '}
                      {notif.content}
                    </p>
                  </div>
                  {notif.title && (
                    <p className='font-semibold'>{notif.title}</p>
                  )}
                  <p className='mt-1 text-xs text-muted-foreground'>
                    {new Date(notif.timestamp).toLocaleString()}
                  </p>
                </div>
                {!notif.isRead && (
                  <div
                    className='mt-1 h-2.5 w-2.5 rounded-full bg-blue-500'
                    aria-label='Unread'
                  />
                )}
              </CardContent>
            </Card>
          </Link>
        ))}
        {notifications.length === 0 && !loading && (
          <div className='py-12 text-center text-muted-foreground'>
            <p>You have no new notifications.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// components/academic-content/comment-dialog.tsx
'use client';

import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { ThumbsUp, CornerUpRight } from 'lucide-react';
import { AcademicContent, Student } from '@/lib/types';

interface CommentDialogProps {
  content: AcademicContent | null;
  students: { [id: string]: Student };
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CommentDialog({
  content,
  students,
  open,
  onOpenChange,
}: CommentDialogProps) {
  if (!content) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-2xl'>
        <DialogHeader>
          <DialogTitle>Comments on "{content.contentTitle}"</DialogTitle>
          <DialogDescription>
            Join the discussion and share your thoughts.
          </DialogDescription>
        </DialogHeader>
        <div className='max-h-[60vh] space-y-6 overflow-y-auto p-4'>
          {content.comments.length > 0 ? (
            content.comments
              .sort(
                (a, b) =>
                  new Date(b.timestamp).getTime() -
                  new Date(a.timestamp).getTime()
              )
              .map((comment, index) => {
                const commenter = students[comment.commentorId];
                return (
                  <div key={index} className='flex items-start gap-4'>
                    <Avatar className='h-9 w-9'>
                      <AvatarImage
                        src={
                          commenter?.profileImage
                            ? `/api/students/${commenter.id}/image`
                            : `/api/students/placeholderDP.jpg/image`
                        }
                        alt={commenter?.name_first}
                      />
                      <AvatarFallback>
                        {commenter?.name_first?.[0]}
                        {commenter?.name_last?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className='flex-1'>
                      <div className='flex items-center justify-between'>
                        <p className='font-semibold'>
                          {commenter
                            ? `${commenter.name_first} ${commenter.name_last}`
                            : 'Unknown User'}
                        </p>
                        <p className='text-xs text-muted-foreground'>
                          {new Date(comment.timestamp).toLocaleDateString(
                            'en-US',
                            {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            }
                          )}
                        </p>
                      </div>
                      <p className='mt-1 text-muted-foreground'>
                        {comment.comment}
                      </p>
                      <div className='mt-2 flex items-center gap-4'>
                        <Button
                          variant='ghost'
                          size='sm'
                          className='flex items-center gap-1'
                        >
                          <ThumbsUp className='h-4 w-4' />
                          <span>{comment.upvotes}</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })
          ) : (
            <div className='py-8 text-center text-muted-foreground'>
              <p>No comments yet. Be the first to share your thoughts!</p>
            </div>
          )}
        </div>
        <Separator />
        <DialogFooter className='p-4'>
          <div className='flex w-full items-center gap-2'>
            <Input placeholder='Write a comment...' />
            <Button>
              <CornerUpRight className='h-4 w-4' />
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

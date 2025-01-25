'use client';

import { Main } from '@/components/Layout/Main';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { SupportTicket, User } from '@/payload-types';
import { getClientSideURL } from '@/utilities/getURL';
import { lorelei } from '@dicebear/collection';
import { createAvatar } from '@dicebear/core';
import {
  IconArrowLeft,
  IconDotsVertical,
  IconPaperclip,
  IconPhone,
  IconPhotoPlus,
  IconPlus,
  IconSend,
  IconVideo,
} from '@tabler/icons-react';
import { StaticImageData } from 'next/image';
import { Fragment, useState } from 'react';
import { format } from 'timeago.js';

import { conversations } from './data.json';

type ChatUser = (typeof conversations)[number];
type Convo = ChatUser['messages'][number];

export function TicketChat({ ticket }: { ticket: SupportTicket }) {
  const [search, setSearch] = useState('Alex John');
  const [selectedUser, setSelectedUser] = useState<ChatUser>(conversations[0]);
  const [mobileSelectedUser, setMobileSelectedUser] = useState<ChatUser | null>(
    null,
  );
  let src: StaticImageData | string = '';
  //const currentMessage: unknown[] = [];

  const user = (ticket.user as User) ?? null;

  if (user?.avatar && typeof user?.avatar === 'object') {
    const { url } = user?.avatar;

    src = `${getClientSideURL()}${url}`;
  } else {
    src = createAvatar(lorelei, {
      seed: user?.name || '',
      size: 128,
      // ... other options
    }).toDataUri();
  }

  /**const selectedUser = {
    name: user?.name ?? ticket.guest?.name,
    email: user?.name ?? ticket.guest?.email,
    title: user ? 'User' : 'Guest',
  };

  currentMessage.push({
    sender: user ? 'User' : 'Guest',
    timestamp: ticket.createdAt,
    message: ticket.description,
  });*/

  // Filtered data based on the search query
  const filteredChatList = conversations.filter(({ fullName }) =>
    fullName.toLowerCase().includes(search.trim().toLowerCase()),
  );

  const currentMessage = selectedUser.messages.reduce(
    (acc: Record<string, Convo[]>, obj) => {
      const key = format(obj.timestamp, 'd MMM, yyyy');

      // Create an array for the category if it doesn't exist
      if (!acc[key]) {
        acc[key] = [];
      }

      // Push the current object to the array
      acc[key].push(obj);

      return acc;
    },
    {},
  );

  return (
    <Main fixed>
      {/* Right Side */}
      <div
        className={cn(
          'absolute inset-0 left-full z-50 hidden w-full flex-1 flex-col rounded-md border bg-primary-foreground shadow-sm transition-all duration-200 sm:static sm:z-auto sm:flex',
          mobileSelectedUser && 'left-0 flex',
        )}
      >
        {/* Top Part */}
        <div className="mb-1 flex flex-none justify-between rounded-t-md bg-secondary p-4 shadow-lg">
          {/* Left */}
          <div className="flex gap-3">
            <Button
              size="icon"
              variant="ghost"
              className="-ml-2 h-full sm:hidden"
              onClick={() => setMobileSelectedUser(null)}
            >
              <IconArrowLeft />
            </Button>
            <div className="flex items-center gap-2 lg:gap-4">
              <Avatar className="size-9 lg:size-11">
                <AvatarImage src={src} alt={selectedUser.name} />
                <AvatarFallback>{selectedUser.name}</AvatarFallback>
              </Avatar>
              <div>
                <span className="col-start-2 row-span-2 text-sm font-medium lg:text-base">
                  {selectedUser.name}
                </span>
                <span className="col-start-2 row-span-2 row-start-2 line-clamp-1 block max-w-32 text-ellipsis text-nowrap text-xs text-muted-foreground lg:max-w-none lg:text-sm">
                  {selectedUser.title}
                </span>
              </div>
            </div>
          </div>

          {/* Right */}
          <div className="-mr-1 flex items-center gap-1 lg:gap-2">
            <Button
              size="icon"
              variant="ghost"
              className="hidden size-8 rounded-full sm:inline-flex lg:size-10"
            >
              <IconVideo size={22} className="stroke-muted-foreground" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="hidden size-8 rounded-full sm:inline-flex lg:size-10"
            >
              <IconPhone size={22} className="stroke-muted-foreground" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-10 rounded-md sm:h-8 sm:w-4 lg:h-10 lg:w-6"
            >
              <IconDotsVertical className="stroke-muted-foreground sm:size-5" />
            </Button>
          </div>
        </div>

        {/* Conversation */}
        <div className="flex flex-1 flex-col gap-2 rounded-md px-4 pb-4 pt-0">
          <div className="flex size-full flex-1">
            <div className="chat-text-container relative -mr-4 flex flex-1 flex-col overflow-y-hidden">
              <div className="chat-flex flex h-40 w-full flex-grow flex-col-reverse justify-start gap-4 overflow-y-auto py-2 pb-4 pr-4">
                {currentMessage &&
                  Object.keys(currentMessage).map((key) => (
                    <Fragment key={key}>
                      {currentMessage[key].map((msg, index) => (
                        <div
                          key={`${msg.sender}-${msg.timestamp}-${index}`}
                          className={cn(
                            'chat-box max-w-72 break-words px-3 py-2 shadow-lg',
                            msg.sender === 'You'
                              ? 'self-end rounded-[16px_16px_0_16px] bg-primary/85 text-primary-foreground/75'
                              : 'self-start rounded-[16px_16px_16px_0] bg-secondary',
                          )}
                        >
                          {msg.message}{' '}
                          <span
                            className={cn(
                              'mt-1 block text-xs font-light italic text-muted-foreground',
                              msg.sender === 'You' && 'text-right',
                            )}
                          >
                            {format(msg.timestamp)}
                          </span>
                        </div>
                      ))}
                      <div className="text-center text-xs">{key}</div>
                    </Fragment>
                  ))}
              </div>
            </div>
          </div>
          <form className="flex w-full flex-none gap-2">
            <div className="flex flex-1 items-center gap-2 rounded-md border border-input px-2 py-1 focus-within:outline-none focus-within:ring-1 focus-within:ring-ring lg:gap-4">
              <div className="space-x-1">
                <Button
                  size="icon"
                  type="button"
                  variant="ghost"
                  className="h-8 rounded-md"
                >
                  <IconPlus size={20} className="stroke-muted-foreground" />
                </Button>
                <Button
                  size="icon"
                  type="button"
                  variant="ghost"
                  className="hidden h-8 rounded-md lg:inline-flex"
                >
                  <IconPhotoPlus
                    size={20}
                    className="stroke-muted-foreground"
                  />
                </Button>
                <Button
                  size="icon"
                  type="button"
                  variant="ghost"
                  className="hidden h-8 rounded-md lg:inline-flex"
                >
                  <IconPaperclip
                    size={20}
                    className="stroke-muted-foreground"
                  />
                </Button>
              </div>
              <label className="flex-1">
                <span className="sr-only">Chat Text Box</span>
                <input
                  type="text"
                  placeholder="Type your messages..."
                  className="h-8 w-full bg-inherit focus-visible:outline-none"
                />
              </label>
              <Button
                variant="ghost"
                size="icon"
                className="hidden sm:inline-flex"
              >
                <IconSend size={20} />
              </Button>
            </div>
            <Button className="h-full sm:hidden">
              <IconSend size={18} /> Send
            </Button>
          </form>
        </div>
      </div>
    </Main>
  );
}

'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import type { SupportTicket, User } from '@/payload-types';
import { Main } from '@/components/Layout/Main';
import { toast } from 'sonner';
import { PRIORITY, TICKETS_CATEGORY, TICKETS_STATUS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import {
  IconArrowLeft,
  IconMessages,
  IconPaperclip,
  IconPhotoPlus,
  IconPlus,
  IconSearch,
  IconSend,
} from '@tabler/icons-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'timeago.js';
import { getClientSideURL } from '@/utilities/getURL';
import { createAvatar } from '@dicebear/core';
import { lorelei } from '@dicebear/collection';
import { StaticImageData } from 'next/image';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Check, ChevronsUpDown } from 'lucide-react';
import { fetcher } from '@/lib/fetcher';

interface Conversations {
  id: string;
  profile: string;
  fullName: string;
  title: string;
  category: 'other' | 'bug' | 'account' | 'payments' | 'learn';
  priority: 'low' | 'medium' | 'high';
  status: 'new' | 'done' | 'canceled' | 'unanswered';
  messages: {
    id: string;
    message: string;
    timestamp: string;
    sender: string;
  }[];
}

type ChatUser = Conversations[number];
type Convo = ChatUser['messages'][number];

export function AppAdminSupport({ tickets }: { tickets: SupportTicket[] }) {
  const [search, setSearch] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('new');
  const [mobileSelectedUser, setMobileSelectedUser] =
    React.useState<ChatUser | null>(null);

  const conversations = tickets.map((ticket) => {
    const user = (ticket.user as User) ?? null;

    const src = () => {
      let src: StaticImageData | string = '';

      if (user?.avatar && typeof user?.avatar === 'object') {
        const { url } = user?.avatar;

        src = `${getClientSideURL()}${url}`;
      }

      if (src === '') {
        src = createAvatar(lorelei, {
          seed: user?.name || '',
          size: 128,
          // ... other options
        }).toDataUri();
      }

      return src;
    };

    return {
      id: ticket.id,
      profile: src(),
      fullName: user ? user.name : ticket.guest?.name,
      title: user ? 'User' : 'Guest',
      category: ticket.category,
      priority: ticket.priority,
      status: ticket.status,
      messages: ticket.messages,
    };
  });

  const [selectedTicket, setSelectedTicket] = React.useState<ChatUser>(
    conversations[0],
  );
  let [filteredChatList, setFilteredChatList] = React.useState(conversations);

  // Filtered data based on the search query
  //filteredChatList = conversations.filter(({ fullName }) =>
  //  fullName?.toLowerCase().includes(search.trim().toLowerCase()),
  //);

  const handleSearch = (value: string) => {
    setSearch(value);
    const filtered = filteredChatList.filter(({ fullName }) =>
      fullName?.toLowerCase().includes(search.trim().toLowerCase()),
    );
    setFilteredChatList(filtered);
  };

  filteredChatList = conversations.filter(({ status }) =>
    status?.toLowerCase().includes(statusFilter.trim().toLowerCase()),
  );

  const currentMessage = selectedTicket.messages.reduce(
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
      <section className="flex h-full gap-6">
        {/* Left Side */}
        <div className="flex w-full flex-col gap-2 sm:w-56 lg:w-72 2xl:w-80">
          <div className="sticky top-0 z-10 -mx-4 bg-background px-4 pb-3 shadow-md sm:static sm:z-auto sm:mx-0 sm:p-0 sm:shadow-none">
            <div className="flex w-full items-center justify-between py-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="text-2xl font-bold">
                  <SelectValue />
                  <IconMessages size={20} />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="done">Done</SelectItem>
                    <SelectItem value="canceled">Canceled</SelectItem>
                    <SelectItem value="unanswered">Unanswered</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <label className="flex h-12 w-full items-center space-x-0 rounded-md border border-input pl-2 focus-within:outline-none focus-within:ring-1 focus-within:ring-ring">
              <IconSearch size={15} className="mr-2 stroke-slate-500" />
              <span className="sr-only">Search</span>
              <input
                type="text"
                className="w-full flex-1 bg-inherit text-sm focus-visible:outline-none"
                placeholder="Search chat..."
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </label>
          </div>

          <ScrollArea className="-mx-3 h-full p-3">
            {filteredChatList.map((chatUsr) => {
              const { id, profile, messages, fullName } = chatUsr;
              const lastConvo = messages[0];
              const lastMsg =
                lastConvo.sender === 'system'
                  ? `You: ${lastConvo.message}`
                  : lastConvo.message;
              return (
                <React.Fragment key={id}>
                  <button
                    type="button"
                    className={cn(
                      `-mx-1 flex w-full rounded-md px-2 py-2 text-left text-sm hover:bg-secondary/75`,
                      selectedTicket.id === id && 'sm:bg-muted',
                    )}
                    onClick={() => {
                      setSelectedTicket(chatUsr);
                      setMobileSelectedUser(chatUsr);
                    }}
                  >
                    <div className="flex gap-2">
                      <Avatar>
                        <AvatarImage src={profile} alt={fullName as string} />
                        <AvatarFallback>{fullName}</AvatarFallback>
                      </Avatar>
                      <div>
                        <span className="col-start-2 row-span-2 font-medium">
                          {fullName}
                        </span>
                        <span className="col-start-2 row-span-2 row-start-2 line-clamp-2 text-ellipsis text-muted-foreground">
                          {lastMsg}
                        </span>
                      </div>
                    </div>
                  </button>
                  <Separator className="my-1" />
                </React.Fragment>
              );
            })}
          </ScrollArea>
        </div>

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
                  <AvatarImage
                    src={selectedTicket.profile}
                    alt={selectedTicket.fullName}
                  />
                  <AvatarFallback>{selectedTicket.fullName}</AvatarFallback>
                </Avatar>
                <div>
                  <span className="col-start-2 row-span-2 text-sm font-medium lg:text-base">
                    {selectedTicket.fullName}
                  </span>
                  <span className="col-start-2 row-span-2 row-start-2 line-clamp-1 block max-w-32 text-ellipsis text-nowrap text-xs text-muted-foreground lg:max-w-none lg:text-sm">
                    {selectedTicket.title}
                  </span>
                </div>
              </div>
            </div>

            {/* Right */}
            <div className="-mr-1 flex items-center gap-1 lg:gap-2">
              <Popover>
                <PopoverTrigger asChild className="stroke-muted-foreground">
                  <Button
                    variant="outline"
                    role="combobox"
                    className={cn(
                      'justify-between',
                      !selectedTicket.category && 'stroke-muted-foreground',
                    )}
                  >
                    {selectedTicket.category
                      ? TICKETS_CATEGORY.find(
                          (item) => item.value === selectedTicket.category,
                        )?.label
                      : 'Select category'}
                    <ChevronsUpDown className="opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandList>
                      <CommandGroup>
                        {TICKETS_CATEGORY.map((item) => (
                          <CommandItem
                            value={item.label}
                            key={item.value}
                            onSelect={async () => {
                              try {
                                await fetcher(
                                  `/api/support-tickets/${selectedTicket.id}`,
                                  {
                                    method: 'PATCH',
                                    body: JSON.stringify({
                                      category: item.value,
                                    }),
                                  },
                                );
                                toast.info(`Category changed to ${item.value}`);
                              } catch (error) {
                                throw error;
                              }
                            }}
                          >
                            <Check
                              className={cn(
                                'mr-2',
                                item.value === selectedTicket.category
                                  ? 'opacity-100'
                                  : 'opacity-0',
                              )}
                            />
                            {item.label}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className={cn(
                      'justify-between',
                      !selectedTicket.priority && 'text-muted-foreground',
                    )}
                  >
                    {selectedTicket.priority
                      ? PRIORITY.find(
                          (item) => item.value === selectedTicket.priority,
                        )?.label
                      : 'Select priority'}
                    <ChevronsUpDown className="opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandList>
                      <CommandGroup>
                        {PRIORITY.map((item) => (
                          <CommandItem
                            value={item.label}
                            key={item.value}
                            onSelect={async () => {
                              try {
                                await fetcher(
                                  `/api/support-tickets/${selectedTicket.id}`,
                                  {
                                    method: 'PATCH',
                                    body: JSON.stringify({
                                      priority: item.value,
                                    }),
                                  },
                                );
                                toast.info(`Priority changed to ${item.value}`);
                              } catch (error) {
                                throw error;
                              }
                            }}
                          >
                            <Check
                              className={cn(
                                'mr-2',
                                item.value === selectedTicket.priority
                                  ? 'opacity-100'
                                  : 'opacity-0',
                              )}
                            />
                            {item.label}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Conversation */}
          <div className="flex flex-1 flex-col gap-2 rounded-md px-4 pb-4 pt-0">
            <div className="flex size-full flex-1">
              <div className="chat-text-container relative -mr-4 flex flex-1 flex-col overflow-y-hidden">
                <div className="chat-flex flex h-40 w-full flex-grow flex-col-reverse justify-start gap-4 overflow-y-auto py-2 pb-4 pr-4">
                  {currentMessage &&
                    Object.keys(currentMessage).map((key) => (
                      <React.Fragment key={key}>
                        {currentMessage[key].map((msg, index) => (
                          <div
                            key={`${msg.sender}-${msg.timestamp}-${index}`}
                            className={cn(
                              'chat-box max-w-96 break-words px-3 py-2 shadow-lg',
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
                              {format(msg.timestamp, 'h:mm a')}
                            </span>
                          </div>
                        ))}
                        <div className="text-center text-xs">{key}</div>
                      </React.Fragment>
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
      </section>
    </Main>
  );
}

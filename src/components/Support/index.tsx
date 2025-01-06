'use client';

import * as React from 'react';
import { ButtonHTMLAttributes } from 'react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/providers/Auth';
import { z } from 'zod';
import { PRIORITY, TICKETS_CATEGORY } from '@/lib/constants';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { usePathname } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  createSupportTicket,
  type CreateSupportTicketData,
} from '@/utilities/support';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Check, ChevronsUpDown, Link, Loader2 as Spinner } from 'lucide-react';
import { Command, CommandGroup, CommandItem, CommandList } from '../ui/command';
import { cn } from '@/lib/utils';

const supportFormSchema = z.object({
  url: z.string(),
  description: z.string().min(30),
  guest: z
    .object({
      name: z.string(),
      email: z.string().email(),
    })
    .optional(),
  category: z.enum(['other', 'bug', 'account', 'payments', 'learn']),
  priority: z.enum(['low', 'medium', 'high']),
  status: z.enum(['new', 'done', 'canceled', 'unanswered']),
});

type SupportFormValues = z.infer<typeof supportFormSchema>;

interface Guest {
  name: string;
  email: string;
}

export function Support(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [guest, setGuest] = React.useState<Guest | undefined>({
    name: '',
    email: '',
  });
  const id = React.useId();
  const pathname = usePathname();
  const { user, isSignedIn, isLoaded } = useAuth();

  const defaultValues: SupportFormValues = {
    url: pathname as string,
    description: '',
    category: 'other',
    priority: 'medium',
    status: 'new',
    guest: guest,
  };

  const form = useForm<SupportFormValues>({
    resolver: zodResolver(supportFormSchema),
    defaultValues,
  });

  React.useEffect(() => {
    if (isSignedIn) {
      form.setValue('guest', { name: user?.name, email: user?.email });
    }
  }, [form, isSignedIn, user?.email, user?.name]);

  const create = useMutation({
    mutationFn: (data: CreateSupportTicketData) => createSupportTicket(data),
    onSuccess: () => {
      toast.success('Support ticket created');
      form.reset(defaultValues);
    },
    onError: (error) => {
      toast.error('Failed to create support ticket');
    },
  });

  const onSubmit = async (values: SupportFormValues) => {
    setIsLoading(true);
    const data: CreateSupportTicketData = {
      ...values,
      user: user ?? undefined,
    };

    await create.mutateAsync(data);
    /**toast.info('Form values', {
      description: `${JSON.stringify(values)}`,
    });
    form.reset(defaultValues);*/
    setIsLoading(false);
  };

  return (
    <Dialog>
      <DialogTrigger {...props} />
      <DialogPortal>
        <DialogOverlay className="bg-fd-background/50 data-[state=closed]:animate-fd-fade-out data-[state=open]:animate-fd-fade-in fixed inset-0 z-50 backdrop-blur-sm" />
        <DialogContent
          aria-describedby={undefined}
          className="bg-fd-popover text-fd-popover-foreground data-[state=closed]:animate-fd-dialog-out data-[state=open]:animate-fd-dialog-in fixed left-1/2 z-50 my-[5vh] flex max-h-[90dvh] w-[98vw] max-w-[860px] origin-left -translate-x-1/2 flex-col rounded-lg border shadow-lg focus-visible:outline-none"
        >
          <DialogTitle className="sr-only">Support</DialogTitle>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Open a support ticket</CardTitle>
                  <CardDescription>
                    What area are you having problems with?
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem className="grid gap-2">
                          <FormLabel>Category</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  role="combobox"
                                  className={cn(
                                    'justify-between',
                                    !field.value && 'text-muted-foreground',
                                  )}
                                >
                                  {field.value
                                    ? TICKETS_CATEGORY.find(
                                        (item) => item.value === field.value,
                                      )?.label
                                    : 'Select category'}
                                  <ChevronsUpDown className="opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-[200px] p-0">
                              <Command>
                                <CommandList>
                                  <CommandGroup>
                                    {TICKETS_CATEGORY.map((item) => (
                                      <CommandItem
                                        value={item.label}
                                        key={item.value}
                                        onSelect={() => {
                                          form.setValue('category', item.value);
                                        }}
                                      >
                                        <Check
                                          className={cn(
                                            'mr-2',
                                            item.value === field.value
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
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="priority"
                      render={({ field }) => (
                        <FormItem className="grid gap-2">
                          <FormLabel>Priority</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  role="combobox"
                                  className={cn(
                                    'justify-between',
                                    !field.value && 'text-muted-foreground',
                                  )}
                                >
                                  {field.value
                                    ? PRIORITY.find(
                                        (item) => item.value === field.value,
                                      )?.label
                                    : 'Select priority'}
                                  <ChevronsUpDown className="opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-[200px] p-0">
                              <Command>
                                <CommandList>
                                  <CommandGroup>
                                    {PRIORITY.map((item) => (
                                      <CommandItem
                                        value={item.label}
                                        key={item.value}
                                        onSelect={() => {
                                          form.setValue('priority', item.value);
                                        }}
                                      >
                                        <Check
                                          className={cn(
                                            'mr-2',
                                            item.value === field.value
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
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid gap-2">
                    <div className="flex">
                      <Link className="mr-2 h-3 w-3 opacity-50" />
                      {defaultValues.url}
                    </div>
                  </div>
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <div className="grid gap-2">
                        <Label htmlFor={`description-${id}`}>Description</Label>
                        <FormControl>
                          <Textarea
                            id={`description-${id}`}
                            placeholder="Please include all information relevant to your issue."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-red-600" />
                      </div>
                    )}
                  />
                  {!isSignedIn && (
                    <>
                      <FormField
                        control={form.control}
                        name="guest.name"
                        render={({ field }) => (
                          <div className="grid gap-2">
                            <FormItem>
                              <FormLabel>Name</FormLabel>
                              <FormControl>
                                <Input
                                  required
                                  placeholder="Your name"
                                  {...field}
                                  disabled={isLoading}
                                />
                              </FormControl>
                              <FormMessage className="text-red-600" />
                            </FormItem>
                          </div>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="guest.email"
                        render={({ field }) => (
                          <div className="grid gap-2">
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input
                                  required
                                  placeholder="Your email"
                                  {...field}
                                  className="w-full"
                                  disabled={isLoading}
                                />
                              </FormControl>
                              <FormMessage className="text-red-600" />
                            </FormItem>
                          </div>
                        )}
                      />
                    </>
                  )}
                  <div className="grid gap-2"></div>
                </CardContent>
                <CardFooter className="justify-between space-x-2">
                  <DialogClose asChild>
                    <Button variant="ghost" size="sm" disabled={isLoading}>
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button size="sm" disabled={isLoading}>
                    {isLoading && (
                      <Spinner className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Submit
                  </Button>
                </CardFooter>
              </Card>
            </form>
          </Form>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}

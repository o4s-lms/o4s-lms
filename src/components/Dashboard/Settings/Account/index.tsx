'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { CalendarIcon, Check, ChevronsUpDown } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Loader2 as Spinner } from 'lucide-react';

import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Dropzone,
  DropZoneArea,
  DropzoneDescription,
  DropzoneFileList,
  DropzoneFileListItem,
  DropzoneFileMessage,
  DropzoneTrigger,
  DropzoneMessage,
  DropzoneRemoveFile,
  DropzoneRetryFile,
  InfiniteProgress,
  useDropzone,
} from '@/components/ui/dropzone';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { User } from '@/payload-types';
import { setLanguage } from '@/tolgee/language';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getClientSideURL } from '@/utilities/getURL';
import { StaticImageData } from 'next/image';

const languages = [
  { label: 'Português', value: 'pt' },
  { label: 'English', value: 'en' },
  { label: 'Français', value: 'fr' },
  { label: 'Españhol', value: 'es' },
] as const;

const accountFormSchema = z.object({
  name: z
    .string()
    .min(8, {
      message: 'Name must be at least 8 characters.',
    })
    .max(30, {
      message: 'Name must not be longer than 30 characters.',
    }),
  language: z.enum(['pt', 'en', 'fr', 'es'], {
    required_error: 'Please select a language.',
  }),
});

type AccountFormValues = z.infer<typeof accountFormSchema>;

export function AccountForm({ currentUser }: { currentUser: User }) {
  const [user, setUser] = React.useState<User>(currentUser);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  
  let src: StaticImageData | string = '';

  const defaultValues: Partial<AccountFormValues> = {
    name: user.name,
    language: user.language,
  };

  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues,
  });

  const onSubmit = React.useCallback(
    async (values: AccountFormValues) => {
      setIsLoading(true);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/${user.id}`,
        {
          // Make sure to include cookies with fetch
          body: JSON.stringify(values),
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'PATCH',
        },
      );

      if (response.ok) {
        const json = await response.json();
        setUser(json.doc);
        if (json.doc.language !== defaultValues.language)
          setLanguage(json.doc.language);
        toast.info('Successfully updated account.');
        form.reset({
          name: json.doc.name,
          language: json.doc.language,
        });
      } else {
        toast.error('There was a problem updating your account.');
      }

      setIsLoading(false);
      return;
    },
    [defaultValues.language, form, user.id],
  );

  const recoverPassword = React.useCallback(async (data: { email: string }) => {
    setIsLoading(true);
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/forgot-password`,
      {
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      },
    );

    if (response.ok) {
      toast.info('We sent an email to reset your password.');
    } else {
      toast.error('Something went wrong.', {
        description:
          'There was a problem while attempting to send you a password reset email. Please try again.',
      });
      setIsLoading(false);
    }
  }, []);

  const dropzone = useDropzone({
    onDropFile: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/avatar`,
        {
          method: 'POST',
          credentials: 'include',
          body: formData,
          /**
           * Do not manually add the Content-Type Header
           * the browser will handle this.
           *
           * headers: {
           *  'Content-Type': 'multipart/form-data'
           * }
           */
        },
      );

      if (response.ok) {
        const json = await response.json();

        await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/${user.id}`,
          {
            // Make sure to include cookies with fetch
            body: JSON.stringify({
              avatar: json.doc.id,
            }),
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
            method: 'PATCH',
          },
        );

        return {
          status: 'success',
          result: json.doc.url,
        };
      }

      return {
        status: 'error',
        error: 'Something is wrong',
      };
    },
    validation: {
      accept: {
        'image/*': ['.png', '.jpg', '.jpeg'],
      },
      maxSize: 1024 * 1024,
      maxFiles: 1,
    },
    shiftOnMaxFiles: true,
  });

  if (user?.avatar && typeof user?.avatar === 'object') {
    const { url } = user?.avatar;

    src = `${getClientSideURL()}${url}`;
  }

  const avatarSrc = dropzone.fileStatuses[0]?.result ?? src;
  const isPending = dropzone.fileStatuses[0]?.status === 'pending';

  return (
    <>
      <div className="flex flex-col pb-8">
        <Dropzone {...dropzone}>
          <div className="flex justify-between">
            <DropzoneMessage />
          </div>
          <DropZoneArea>
            <DropzoneTrigger className="flex gap-8 bg-transparent text-sm">
              <Avatar className={cn(isPending && 'animate-pulse')}>
                <AvatarImage className="object-cover" src={avatarSrc} />
                <AvatarFallback>JG</AvatarFallback>
              </Avatar>
              <div className="flex flex-col gap-1 font-semibold">
                <p>Upload a new avatar</p>
                <p className="text-xs text-muted-foreground">
                  Please select an image smaller than 1MB
                </p>
              </div>
            </DropzoneTrigger>
          </DropZoneArea>
        </Dropzone>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Your name" {...field} />
                </FormControl>
                <FormDescription>
                  This is the name that will be displayed on your profile and in
                  emails.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="language"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Language</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          'w-[200px] justify-between',
                          !field.value && 'text-muted-foreground',
                        )}
                      >
                        {field.value
                          ? languages.find(
                              (language) => language.value === field.value,
                            )?.label
                          : 'Select language'}
                        <ChevronsUpDown className="opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0">
                    <Command>
                      <CommandInput placeholder="Search language..." />
                      <CommandList>
                        <CommandEmpty>No language found.</CommandEmpty>
                        <CommandGroup>
                          {languages.map((language) => (
                            <CommandItem
                              value={language.label}
                              key={language.value}
                              onSelect={() => {
                                form.setValue('language', language.value);
                              }}
                            >
                              <Check
                                className={cn(
                                  'mr-2',
                                  language.value === field.value
                                    ? 'opacity-100'
                                    : 'opacity-0',
                                )}
                              />
                              {language.label}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  This is the language that will be used in the dashboard.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Spinner className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? 'Processing' : 'Update account'}
          </Button>
        </form>
      </Form>

      <p>
        {'To change your password, '}
        <Button
          variant="link"
          onClick={() => recoverPassword({ email: user.email })}
          disabled={isLoading}
        >
          click here
        </Button>
      </p>
    </>
  );
}

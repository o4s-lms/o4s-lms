import RichText from '@/components/RichText';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { createAvatar } from '@dicebear/core';
import { lorelei } from '@dicebear/collection';

import type { TestimonialBlock as TestimonialBlockProps } from '@/payload-types';

export const TestimonialBlock: React.FC<TestimonialBlockProps> = ({
  testimonials,
  richTextBefore,
}) => {
  return (
    <div className="container py-24 sm:py-32">
      <div className="my-16">
        {richTextBefore && (
          <RichText data={richTextBefore} enableGutter={false} />
        )}
      </div>

      <div className="mx-auto grid columns-2 space-y-4 sm:block md:grid-cols-2 lg:columns-3 lg:grid-cols-4 lg:gap-6 lg:space-y-6">
        {testimonials?.map(({ id, name, username, comment }) => (
          <Card
            key={id}
            className="max-w-md overflow-hidden md:break-inside-avoid"
          >
            <CardHeader className="flex flex-row items-center gap-4 pb-2">
              <Avatar>
                <AvatarImage
                  alt={name}
                  src={createAvatar(lorelei, {
                    seed: name,
                    size: 128,
                    // ... other options
                  }).toDataUri()}
                />
                <AvatarFallback>OM</AvatarFallback>
              </Avatar>

              <div className="flex flex-col">
                <CardTitle className="text-lg">{name}</CardTitle>
                {username && <CardDescription>{username}</CardDescription>}
              </div>
            </CardHeader>

            <CardContent>{comment}</CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

import clsx from 'clsx';
import React from 'react';
import RichText from '@/components/RichText';

import type { Section } from '@/payload-types';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export type CourseSectionsProps = {
  className?: string;
  docs?: Section[];
  introContent?: string;
};

export const CourseSections: React.FC<CourseSectionsProps> = (props) => {
  const { className, docs, introContent } = props;

  return (
    <div className={className}>
      <div className="prose max-w-none dark:prose-invert">
        <h4>{introContent}</h4>
      </div>
      <Accordion type="single" collapsible className="w-full">
        {docs?.map((section, index) => (
          <AccordionItem key={index} value={'index-' + index}>
            <AccordionTrigger>{section.title}</AccordionTrigger>
            <AccordionContent>
              {section.richText && (
                <RichText
                  className="mx-auto max-w-[48rem]"
                  data={section.richText}
                  enableGutter={false}
                />
              )}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

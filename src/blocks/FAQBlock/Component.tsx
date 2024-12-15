import React from 'react';

import type { FAQBlock as FAQBlockProps } from '@/payload-types';

import RichText from '@/components/RichText';

import {
  Accordion,
  AccordionTrigger,
  AccordionItem,
  AccordionContent,
} from '@/components/ui/accordion';

export const FAQBlock: React.FC<FAQBlockProps> = ({
  faqs,
  richTextBefore,
  richTextAfter,
}) => {
  return (
    <div className="container py-24 sm:py-32">
      {richTextBefore && (
        <RichText data={richTextBefore} enableGutter={false} />
      )}

      <Accordion type="single" collapsible className="AccordionRoot w-full">
        {faqs?.map(({ id, question, answer }) => (
          <AccordionItem key={id} value={id || ''}>
            <AccordionTrigger className="text-left">
              {question}
            </AccordionTrigger>

            <AccordionContent>{answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      {richTextAfter && <RichText data={richTextAfter} enableGutter={false} />}
    </div>
  );
};

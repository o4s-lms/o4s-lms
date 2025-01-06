import * as React from 'react';

import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from '@react-email/components';
import type { SupportTicket } from '@/payload-types';

export const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL;

export function NewSupportTicketEmail({ ticket }: { ticket: SupportTicket}) {
  return (
    <Html>
      <Head />
      <Preview>New Support Ticket</Preview>
      <Tailwind>
        <React.Fragment>
          <Body className="mx-auto my-auto bg-white font-sans">
            <Container className="mx-auto my-[40px] w-[465px] rounded border border-solid border-[#eaeaea] p-[20px]">
              <Section className="mt-[32px]">
                <Img
                  src={`${BASE_URL}/iconO4S-100x100.png`}
                  width="100"
                  height="100"
                  alt="Open For Sustainability"
                  className="mx-auto my-0"
                />
              </Section>

              <Section className="mb-[32px] mt-[32px]">
              <Text className="mb-8 text-[14px] font-medium leading-[24px] text-black">
                  Hi,
                </Text>
              </Section>


              <Section className="mb-[32px] mt-[32px] text-center">
                <Text className="mb-8 text-[14px] font-medium leading-[24px] text-black">
                  New support Ticket ID: {ticket.id}
                </Text>
                <Text className="mb-8 text-[14px] font-medium leading-[24px] text-black">
                  {ticket.description}
                </Text>

                <Text className="text-[14px] font-medium leading-[24px] text-black">
                  <Link
                    href={`${BASE_URL}/manage/support-tickets`}
                    target="_blank"
                    className="text-[#2754C5] underline"
                  >
                    View the support tickets
                  </Link>
                </Text>
              </Section>

              <Hr className="mx-0 my-[26px] w-full border border-solid border-[#eaeaea]" />

              <Text className="flex items-center justify-center text-[12px] leading-[24px] text-[#666666]">
                © 2014-2025 José Cordeiro. All rights reserved.
              </Text>
            </Container>
          </Body>
        </React.Fragment>
      </Tailwind>
    </Html>
  );
}
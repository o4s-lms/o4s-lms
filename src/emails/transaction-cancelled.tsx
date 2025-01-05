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
import { Transaction } from '@/payload-types';

export const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL;

export function TransactionCancelledEmail({ transaction }: { transaction: Transaction}) {
  return (
    <Html>
      <Head />
      <Preview>Transaction cancelled</Preview>
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
                  Hi {transaction.name},
                </Text>
              </Section>


              <Section className="mb-[32px] mt-[32px] text-center">
                <Text className="mb-8 text-[14px] font-medium leading-[24px] text-black">
                  After 30 days without the payment your transaction as changed to the status: CANCELLED<br />
                  Transaction ID: {transaction.id}<br />
                  Total: {new Intl.NumberFormat('pt-PT', {
                                    style: 'currency',
                                    currency: 'EUR',
                                  }).format(transaction.total / 100)}
                </Text>

                <Text className="text-[14px] font-medium leading-[24px] text-black">
                  <Link
                    href={`${BASE_URL}/checkout/proof-of-payment?transactionId=${transaction.id}`}
                    target="_blank"
                    className="text-[#2754C5] underline"
                  >
                    Send us the proof of the payment
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
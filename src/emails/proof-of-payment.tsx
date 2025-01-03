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

export const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL;

interface ProofOfPaymentEmail {
  transactionId: string;
  files: [unknown];
}

export function ProofOfPaymentEmail({
  transactionId,
  files,
}: ProofOfPaymentEmail) {
  return (
    <Html>
      <Head />
      <Preview>Payment Instructions</Preview>
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
                  Proof of payment for transaction ID: {transactionId} received,
                </Text>
              </Section>

              {files.map((file) => (
                <>
                  <Section className="mt-[32px]">
                    <Img
                      key={file.uuid}
                      src={`${file.cdnUrl}/-/preview/-/resize/x400/`}
                      width="400"
                      height="400"
                      alt={file.fileInfo.originalFilename || ''}
                      title={file.fileInfo.originalFilename || ''}
                    />
                  </Section>
                  <Text className="mb-8 text-[14px] font-medium leading-[24px] text-black">
                    {file.fileInfo.originalFilename}
                  </Text>
                </>
              ))}

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

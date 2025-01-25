'use client';

import { Button } from '@/components/ui/button';
//import { Transaction } from '@/payload-types';
import { Check, Hourglass } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

interface CompletionProps {
  guest: boolean;
  transactionId: string;
  provider: string;
}

export function Completion({
  guest,
  transactionId,
  provider,
}: CompletionProps) {
  return (
    <div className="flex h-full flex-col items-center justify-center bg-background text-foreground">
      <div className="text-center">
        <div className="mb-4 inline-flex items-center justify-center rounded-full bg-green-500 p-3">
          {provider === 'transfer' ? (
            <Hourglass className="h-16 w-16" />
          ) : (
            <Check className="h-16 w-16" />
          )}
        </div>
        <h1 className="mb-3 text-4xl font-bold">
          {provider === 'transfer' ? 'WAITING' : 'COMPLETED'}
        </h1>
        <p className="mb-1">
          🎉{' '}
          {provider === 'transfer'
            ? 'We are waiting your payment!'
            : 'You have made a course purchase successfully!'}{' '}
          🎉
        </p>
        <p className="mb-3 font-bold">Transaction ID: {transactionId}</p>
        {provider === 'transfer' && (
          <p className="mb-3 font-bold">Payment details: </p>
        )}
      </div>
      <div className="text-centert">
        <p>
          Need help? Contact our{' '}
          <Button variant="link" asChild className="text-primary-700 m-0 p-0">
            <a href="mailto:support@example.com">customer support</a>
          </Button>
          .
        </p>
      </div>
      <div className="bg-secondary-700 hover:bg-secondary-600 mt-2 flex cursor-pointer justify-center rounded-lg px-4 py-2">
        <Button
          variant="secondary"
          asChild
          className="text-primary-700 m-0 p-4"
        >
          {guest ? (
            <Link href="/sign-up" scroll={false}>
              Sign Up/Sign In to see the transaction details
            </Link>
          ) : (
            <Link href="/learn" scroll={false}>
              Go to Courses
            </Link>
          )}
        </Button>
      </div>
    </div>
  );
}

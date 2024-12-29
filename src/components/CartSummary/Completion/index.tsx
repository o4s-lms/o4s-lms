'use client';

import { Button } from '@/components/ui/button';
//import { Transaction } from '@/payload-types';
import { Check } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

interface CompletionProps {
  transactionId: string;
}

export function Completion({ transactionId }: CompletionProps) {
  return (
    <div className="flex h-full flex-col items-center justify-center bg-background text-foreground">
      <div className="text-center">
        <div className="mb-4 inline-flex items-center justify-center rounded-full bg-green-500 p-3">
          <Check className="h-16 w-16" />
        </div>
        <h1 className="mb-3 text-4xl font-bold">COMPLETED</h1>
        <p className="mb-1">
          🎉 You have made a course purchase successfully! 🎉
        </p>
        <p className="mb-3 font-bold">Transaction ID: {transactionId}</p>
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
        <Link href="/dashboard/courses" scroll={false}>
          Go to Courses
        </Link>
      </div>
    </div>
  );
}

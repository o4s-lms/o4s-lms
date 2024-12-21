'use client';

import { Button } from '@/components/ui/button';
import { Transaction } from '@/payload-types';
import { Check } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

interface CompletionProps {
  transaction: Transaction
}

export function Completion({ transaction }: CompletionProps) {
  return (
    <div className="flex flex-col h-full items-center justify-center bg-background text-foreground">
      <div className="text-center">
        <div className="mb-4 rounded-full bg-green-500 p-3 inline-flex items-center justify-center">
          <Check className="h-16 w-16" />
        </div>
        <h1 className="text-4xl font-bold mb-3">COMPLETED</h1>
        <p className="mb-1">
          🎉 You have made a course purchase successfully! 🎉
        </p>
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
      <div className="mt-2 flex justify-center bg-secondary-700 rounded-lg px-4 py-2 hover:bg-secondary-600 cursor-pointer">
        <Link href="/dashboard/courses" scroll={false}>
          Go to Courses
        </Link>
      </div>
    </div>
  );
};


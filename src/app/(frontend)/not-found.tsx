import Link from 'next/link';
import React from 'react';

export default function NotFound() {
  return (
    <div className="flex h-full items-center bg-gray-900 p-16 text-gray-100 dark:bg-gray-50 dark:text-gray-800">
      <div className="container mx-auto my-8 flex flex-col items-center justify-center px-5">
        <div className="max-w-md text-center">
          <h2 className="mb-8 text-9xl font-extrabold text-gray-600 dark:text-gray-400">
            <span className="sr-only">Error</span>404
          </h2>
          <p className="text-2xl font-semibold md:text-3xl">{`Sorry, we couldn't find this page.`}</p>
          <p className="mb-8 mt-4 text-gray-400 dark:text-gray-600">
            But dont worry, you can find plenty of other things on our homepage.
          </p>
          <Link
            rel="noopener noreferrer"
            href="/"
            className="rounded bg-violet-400 px-8 py-3 font-semibold text-gray-900 dark:bg-violet-600 dark:text-gray-50"
          >
            Back to homepage
          </Link>
        </div>
      </div>
    </div>
  );
}

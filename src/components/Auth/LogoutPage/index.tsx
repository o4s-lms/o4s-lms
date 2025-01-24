'use client';

import Link from 'next/link';
import React, { Fragment } from 'react';

interface LogoutProps {
  success: string | null;
  error: string | null;
}

export const LogoutPage = ({ success, error }: LogoutProps) => {

  return (
    <Fragment>
      {(error || success) && (
        <div>
          <h1>{error || success}</h1>
          <p>
            {'What would you like to do next? '}
            <Link
              href="/"
              className="text-lg font-bold transition-colors hover:text-primary"
            >
              Click here
            </Link>
            {` to go to the home page. To log back in, `}
            <Link
              href="/sign-in"
              className="text-lg font-bold transition-colors hover:text-primary"
            >
              click here
            </Link>
            .
          </p>
        </div>
      )}
    </Fragment>
  );
};

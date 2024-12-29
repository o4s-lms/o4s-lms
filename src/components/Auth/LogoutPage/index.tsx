'use client';

import Link from 'next/link';
import React, { Fragment, useEffect, useState } from 'react';

export const LogoutPage: React.FC = () => {
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const performLogout = async () => {
      try {
        await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({}),
        });
        setSuccess('Logged out successfully.');
      } catch (_) {
        setError('You are already logged out.');
      }
    };

    void performLogout();
  }, []);

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

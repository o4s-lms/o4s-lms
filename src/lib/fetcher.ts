export const fetcher = (path: string, opts?: RequestInit) =>
  fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}${path}`, {
    ...opts,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });

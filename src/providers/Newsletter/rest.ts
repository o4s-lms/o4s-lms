import type { NewsletterSignup } from '@/payload-types';

export const rest = async (
  url: string,
  args?: any,
  options?: RequestInit,
): Promise<null | undefined | NewsletterSignup> => {
  const method = options?.method || 'POST';

  try {
    const res = await fetch(url, {
      method,
      ...(method === 'POST' ? { body: JSON.stringify(args) } : {}),
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    const { errors, transaction } = await res.json();

    if (errors) {
      throw new Error(errors[0].message);
    }

    if (res.ok) {
      return transaction;
    }
  } catch (e: unknown) {
    throw new Error(e as string);
  }
};

import type { NewsletterSignup } from '@/payload-types';

export type Subscribe = (args: {
  name?: string;
  email: string;
}) => Promise<NewsletterSignup>;

export interface NewsletterContext {
  subscribe: Subscribe;
  //unsubscrive: Boolean;
};

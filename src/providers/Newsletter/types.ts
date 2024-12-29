import type { NewsletterSignup } from '@/payload-types';

export type Subscribe = (args: {
  name?: string | null;
  email: string;
}) => Promise<NewsletterSignup>;

export interface NewsletterContext {
  subscribe: Subscribe;
  //unsubscrive: Boolean;
}

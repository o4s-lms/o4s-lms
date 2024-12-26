import { getPayload } from "payload";
import config from '@/payload.config';
import { inngest } from "./client";

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    await step.sleep("wait-a-moment", "1s");
    return { message: `Hello ${event.data.email}!` };
  },
);

export const lastLogin = inngest.createFunction(
  { id: "last-login" },
  { event: "users/last.login" },
  async ({ event, step }) => {
    const payload = await getPayload({ config });
    const result = await payload.update({
      collection: 'users',
      depth: 0,
      where: {
        id: {
          equals: event.data.userId,
        }
      },
      data: {
        lastLogin: new Date().toISOString(),
      },
    });
    return result;
  },
);
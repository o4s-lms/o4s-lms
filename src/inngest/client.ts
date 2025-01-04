import { Inngest } from 'inngest';
import { InngestMiddleware } from 'inngest';
import { createPayloadClient } from '@/lib/payload';

const payloadMiddleware = new InngestMiddleware({
  name: 'Payload Middleware',
  async init() {
    const payload = await createPayloadClient();

    return {
      onFunctionRun(ctx) {
        return {
          transformInput(ctx) {
            return {
              // Anything passed via `ctx` will be merged with the function's arguments
              ctx: {
                payload,
              },
            };
          },
        };
      },
    };
  },
});

// Create a client to send and receive events
export const inngest = new Inngest({
  id: 'o4s-lms-app',
  eventKey: process.env.INNGEST_EVENT_KEY,
  middleware: [payloadMiddleware],
});

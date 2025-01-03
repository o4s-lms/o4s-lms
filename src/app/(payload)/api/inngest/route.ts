import { serve } from 'inngest/next';
import { inngest } from '@/inngest/client';
import {
  helloWorld,
  lastLogin,
  lastLessonAccess,
  lessonCompleted,
} from '@/inngest/functions';
import { emailPasswordUpdated } from '@/inngest/auth'
import { emailPaymentInstructions, emailProofOfPayment } from '@/inngest/transactions';

// Create an API that serves zero functions
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    /* your functions will be passed here later! */
    helloWorld,
    lastLogin,
    lastLessonAccess,
    lessonCompleted,
    emailPasswordUpdated,
    emailPaymentInstructions,
    emailProofOfPayment,
  ],
});

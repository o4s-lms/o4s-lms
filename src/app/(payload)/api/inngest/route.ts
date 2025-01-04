import { serve } from 'inngest/next';
import { inngest } from '@/inngest/client';
import {
  lastLessonAccess,
  lessonCompleted,
} from '@/inngest/functions';
import { emailPasswordUpdated, updateUserRole } from '@/inngest/auth'
import { emailPaymentInstructions, emailProofOfPayment } from '@/inngest/transactions';

// Create an API that serves zero functions
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    /* your functions will be passed here later! */
    lastLessonAccess,
    lessonCompleted,
    updateUserRole,
    emailPasswordUpdated,
    emailPaymentInstructions,
    emailProofOfPayment,
  ],
});

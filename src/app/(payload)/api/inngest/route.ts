import { serve } from 'inngest/next';
import { inngest } from '@/inngest/client';
import { lastLessonAccess, lessonCompleted } from '@/inngest/functions';
import {
  emailPasswordUpdated,
  updateUserRole,
  waitUserSignUp,
} from '@/inngest/auth';
import {
  emailPaymentInstructions,
  emailProofOfPayment,
  pendingTransaction,
  processTransaction,
} from '@/inngest/transactions';

// Create an API that serves zero functions
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    /* your functions will be passed here later! */
    lastLessonAccess,
    lessonCompleted,
    waitUserSignUp,
    updateUserRole,
    emailPasswordUpdated,
    emailPaymentInstructions,
    emailProofOfPayment,
    pendingTransaction,
    processTransaction,
  ],
});

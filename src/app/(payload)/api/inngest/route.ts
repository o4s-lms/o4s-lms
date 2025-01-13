import { serve } from 'inngest/next';
import { inngest } from '@/inngest/client';
import { lastLessonAccess } from '@/inngest/functions';
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
import { computeCourseProgress } from '@/inngest/courses';

// Create an API that serves zero functions
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    /* your functions will be passed here later! */
    lastLessonAccess,
    waitUserSignUp,
    updateUserRole,
    emailPasswordUpdated,
    emailPaymentInstructions,
    emailProofOfPayment,
    pendingTransaction,
    processTransaction,
    computeCourseProgress,
  ],
});

import type { GlobalAfterChangeHook } from 'payload';

import { revalidateTag } from 'next/cache';

export const revalidateFooter: GlobalAfterChangeHook = ({
  doc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    payload.logger.info(`Revalidating footer pt`);

    revalidateTag('global_footer_pt');
  }

  return doc;
};
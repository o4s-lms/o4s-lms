import type { AfterChangeHook } from 'payload';

export const loginAfterCreate: AfterChangeHook = async ({
  doc,
  operation,
  req,
  req: { body = {}, payload, res },
}) => {
  if (operation === 'create') {
    const { email, password } = body;

    if (email && password) {
      const { token, user } = await payload.login({
        collection: 'users',
        data: { email, password },
        req,
        res,
      });

      return {
        ...doc,
        token,
        user,
      };
    }
  }

  return doc;
};

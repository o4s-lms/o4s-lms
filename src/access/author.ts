import type { Access } from 'payload';

export const author: Access = ({ req: { user } }) => {
  if (!user) {
    return false;
  }

  return {
    user: {
      equals: user?.id,
    },
  };
};

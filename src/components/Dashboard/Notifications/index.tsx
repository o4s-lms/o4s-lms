'use client';

import { Main } from '@/components/Layout/Main';
import { useQuery, useZero } from '@rocicorp/zero/react';
import { Schema } from '@/zero/schema';

export function Notifications({ userId }: { userId: string }) {
  const z = useZero<Schema>();
  const notificationsQuery = z.query.notification
    .where('recipient', '=', userId)
    .limit(100);

  const [notifications, notificationsDetail] = useQuery(notificationsQuery);

  return (
    <Main fixed>
      <div>
        {notifications.map((notification) => (
          <p key={notification.id as string}>{JSON.stringify(notification)}</p>
        ))}
      </div>
    </Main>
  );
}

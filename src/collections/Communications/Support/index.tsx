import { CollectionConfig } from 'payload';
import { isAdmin } from '@/access/roles';
import { AccessArgs } from 'payload';
import { anyone } from '@/access/anyone';
import { NewSupportTicketEmail } from '@/emails/new-support-ticket';
import { render } from '@react-email/components';
import { PRIORITY, TICKETS_CATEGORY, TICKETS_STATUS } from '@/lib/constants';
import { NewSupportTicketReceivedEmail } from '@/emails/new-support-ticket-received';

export const SupportTickets: CollectionConfig = {
  slug: 'support-tickets',
  admin: {
    useAsTitle: 'category',
    group: 'Communications',
    description: 'System-wide announcements',
  },
  access: {
    read: ({ req: { user } }: AccessArgs) => {
      if (user?.role === 'admin') return true;
      return {
        user: {
          equals: user?.id,
        },
      };
    },
    create: anyone,
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'url',
      type: 'text',
      required: true,
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      options: TICKETS_CATEGORY,
      defaultValue: 'other',
    },
    {
      name: 'priority',
      type: 'select',
      options: PRIORITY,
      defaultValue: 'medium',
    },
    {
      name: 'status',
      type: 'select',
      options: TICKETS_STATUS,
      defaultValue: 'new',
    },
    {
      name: 'guest',
      type: 'group',
      fields: [
        {
          name: 'name',
          type: 'text',
        },
        {
          name: 'email',
          type: 'email',
        },
      ],
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
    },
    {
      name: 'key',
      type: 'text',
    },
    {
      name: 'messages',
      type: 'array',
      fields: [
        // required
        {
          name: 'message',
          type: 'textarea',
          required: true,
        },
        {
          name: 'timestamp',
          type: 'date',
          required: true,
        },
        {
          name: 'sender',
          type: 'select',
          options: [
            {
              label: 'Guest',
              value: 'guest',
            },
            {
              label: 'User',
              value: 'user',
            },
            {
              label: 'System',
              value: 'system',
            },
          ],
          defaultValue: 'guest',
        },
      ],
      required: true,
    },
  ],
  timestamps: true,
  hooks: {
    afterChange: [
      async ({ req, doc, operation }) => {
        if (operation === 'create') {
          await req.payload.sendEmail({
            to: doc.guest.email,
            subject: 'New support ticket received',
            html: await render(<NewSupportTicketReceivedEmail ticket={doc} />),
          });
          await req.payload.sendEmail({
            to: process.env.SUPPORT_TO,
            subject: 'New support ticket received',
            html: await render(<NewSupportTicketEmail ticket={doc} />),
          });
        }
      },
    ],
  },
};

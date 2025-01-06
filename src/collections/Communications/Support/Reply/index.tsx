import { CollectionConfig } from 'payload';
import { isAdmin } from '@/access/roles';
//import { AccessArgs } from 'payload';
import { render } from '@react-email/components';
import { NewSupportTicketReplyEmail } from '@/emails/new-support-ticket-reply';
import { authenticated } from '@/access/authenticated';

export const SupportTicketReplies: CollectionConfig = {
  slug: 'support-ticket-replies',
  admin: {
    useAsTitle: 'type',
    group: 'Support',
    description: 'System-wide support',
  },
  access: {
    /**read: ({ req: { user } }: AccessArgs) => {
      if (user?.role === 'admin') return true; 
      return {
        recipient: {
          equals: {
            user?.email,
          },
        },
      };
    },*/
    read: authenticated,
    create: authenticated,
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'description',
      type: 'textarea',
      required: true,
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        { label: 'System', value: 'system' },
        { label: 'User', value: 'user' },
      ],
      defaultValue: 'system',
    },
    {
      name: 'recipient',
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
      name: 'parent',
      type: 'relationship',
      relationTo: 'support-tickets',
      required: true,
    },
  ],
  timestamps: true,
  hooks: {
    afterChange: [
      async ({ req, doc, operation }) => {
        if (operation === 'create' && doc.type === 'system') {
          await req.payload.sendEmail({
            to: doc.recipient.email,
            subject: 'New reply to your support ticket',
            html: await render(<NewSupportTicketReplyEmail reply={doc} />),
          });
        }
      },
    ],
  },
};
import {
  createTableSchema,
  column,
  createSchema,
  Row,
  ExpressionBuilder,
  TableSchema,
  definePermissions,
  NOBODY_CAN,
  ANYONE_CAN,
} from '@rocicorp/zero';

const { enumeration, json } = column;

const userSchema = createTableSchema({
  tableName: 'user',
  columns: {
    id: 'string',
  },
  primaryKey: 'id',
});

const notificationSchema = createTableSchema({
  tableName: 'notification',
  columns: {
    id: 'string',
    subject: 'string',
    content: 'string',
    type: enumeration<
      | 'course_update'
      | 'assignment'
      | 'achievement'
      | 'announcement'
      | 'system'
      | 'quiz'
      | 'discussion'
    >(),
    priority: enumeration<'low' | 'medium' | 'high'>(),
    read: 'boolean',
    reference: json<{ collection: 'string'; id: 'string' }>(),
  },
  primaryKey: 'id',
  relationships: {
    recipients: {
      sourceField: 'id',
      destField: 'notificationID',
      destSchema: () => recipientSchema,
    },
  },
});

const announcementSchema = createTableSchema({
  tableName: 'announcement',
  columns: {
    id: 'string',
    title: 'string',
    content: 'string',
    type: enumeration<'general' | 'course' | 'system' | 'maintenance'>(),
    priority: enumeration<'low' | 'medium' | 'high'>(),
    audience:
      json<[typeof enumeration<'all' | 'student' | 'teacher' | 'admin'>]>(),
    status: enumeration<'draft' | 'published' | 'scheduled' | 'archived'>(),
    schedule: json<{ publishAt: number; expireAt: number }>(),
  },
  primaryKey: 'id',
});

const recipientSchema = {
  tableName: 'recipient',
  columns: {
    notificationID: 'string',
    userID: 'string',
  },
  primaryKey: ['notificationID', 'userID'],
  relationships: {
    notification: {
      sourceField: 'notificationID',
      destField: 'id',
      destSchema: () => notificationSchema,
    },
    user: {
      sourceField: 'userID',
      destField: 'id',
      destSchema: () => userSchema,
    },
  },
} as const;

export const schema = createSchema({
  version: 1,
  tables: {
    user: userSchema,
    notification: notificationSchema,
    announcement: announcementSchema,
    recipient: recipientSchema,
  },
});

export type Schema = typeof schema;
export type Notification = Row<typeof notificationSchema>;
export type Announcement = Row<typeof announcementSchema>;
export type Recipient = Row<typeof recipientSchema>;
export type User = Row<typeof schema.tables.user>;

/**
type AuthData = {
  sub: string | null;
};

export const permissions = definePermissions<AuthData, Schema>(schema, () => {
  const allowIfLoggedIn = (
    authData: AuthData,
    { cmpLit }: ExpressionBuilder<TableSchema>,
  ) => cmpLit(authData.sub, 'IS NOT', null);

  const allowIfMessageSender = (
    authData: AuthData,
    { cmp }: ExpressionBuilder<typeof messageSchema>,
  ) => cmp('senderID', '=', authData.sub ?? '');

  return {
    notification: {
      row: {
        insert: NOBODY_CAN,
        update: {
          preMutation: NOBODY_CAN,
        },
        delete: NOBODY_CAN,
      },
    },
    user: {
      row: {
        insert: NOBODY_CAN,
        update: {
          preMutation: NOBODY_CAN,
        },
        delete: NOBODY_CAN,
      },
    },
    message: {
      row: {
        // anyone can insert
        insert: ANYONE_CAN,
        // only sender can edit their own messages
        update: {
          preMutation: [allowIfMessageSender],
        },
        // must be logged in to delete
        delete: [allowIfLoggedIn],
      },
    },
  };
});
 */
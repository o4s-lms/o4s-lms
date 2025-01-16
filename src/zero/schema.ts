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

const notificationSchema = createTableSchema({
  tableName: 'notification',
  columns: {
    id: 'string',
    recipient: 'string',
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
});

export const schema = createSchema({
  version: 2,
  tables: {
    notification: notificationSchema,
  },
});

export type Schema = typeof schema;
export type Notification = Row<typeof notificationSchema>;

type AuthData = {
  sub: string | null;
};

export const permissions = definePermissions<AuthData, Schema>(schema, () => {
  const allowIfAdmin = (
    authData: AuthData,
    { cmpLit }: ExpressionBuilder<typeof notificationSchema>,
  ) => cmpLit(authData.sub, '=', '676d9f913e197080a3dd3a48');

  const allowIfMessageRecipient = (
    authData: AuthData,
    { cmp }: ExpressionBuilder<TableSchema>,
  ) => cmp('recipient', '=', authData.sub ?? '');

  return {
    notification: {
      row: {
        read: [allowIfMessageRecipient],
        insert: [allowIfAdmin],
        update: {
          preMutation: [allowIfMessageRecipient],
        },
        delete: NOBODY_CAN,
      },
    },
  };
  /**return {
    notification: {
      row: {
        read: ANYONE_CAN,
        insert: ANYONE_CAN,
        update: ANYONE_CAN,
        delete: NOBODY_CAN,
      },
    },
  };*/
});

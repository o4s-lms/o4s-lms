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
    content: json(),
    type: enumeration<
      | 'general'
      | 'course'
      | 'assignment'
      | 'achievement'
      | 'announcement'
      | 'system'
      | 'quiz'
      | 'discussion'
      | 'maintenance'
    >(),
    priority: enumeration<'low' | 'medium' | 'high'>(),
    read: 'boolean',
    //reference: json<{ collection: 'string'; id: 'string' }>(),
    reference: json(),
  },
  primaryKey: 'id',
  index: 'recipient',
});

export const schema = createSchema({
  version: 2,
  tables: {
    notification: notificationSchema,
  },
});

export type Schema = typeof schema;
//export type Notification = Row<typeof notificationSchema>;
type Notification = typeof schema.tables.notification;

type AuthData = {
  sub: string | null
  role: string | null
};

export const permissions = definePermissions<AuthData, Schema>(schema, () => {
  const allowIfAdmin = (
    authData: AuthData,
    { cmpLit }: ExpressionBuilder<Notification>,
  ) => cmpLit(authData.role, '=', 'admin');

  const allowIfUserIsSelf = (
    authData: AuthData,
    { cmp }: ExpressionBuilder<Notification>,
  ) => cmp('recipient', '=', authData.sub ?? '');

  return {
    notification: {
      row: {
        read: [allowIfUserIsSelf],
        insert: [allowIfAdmin],
        update: {
          preMutation: [allowIfUserIsSelf],
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

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
    name: 'string',
    roles: json<['string']>(),
  },
  primaryKey: 'id',
});

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
  relationships: {
    to: {
      sourceField: 'recipient',
      destSchema: userSchema,
      destField: 'id',
    }
  },
});

export const schema = createSchema({
  version: 1,
  tables: {
    user: userSchema,
    notification: notificationSchema,
  },
});

export type Schema = typeof schema;
export type Notification = Row<typeof notificationSchema>;
export type User = Row<typeof schema.tables.user>;


type AuthData = {
  sub: string | null;
};

export const permissions = definePermissions<AuthData, Schema>(schema, () => {
  /**const allowIfLoggedIn = (
    authData: AuthData,
    { cmpLit }: ExpressionBuilder<TableSchema>,
  ) => cmpLit(authData.sub, 'IS NOT', null);

  const allowIfMessageSender = (
    authData: AuthData,
    { cmp }: ExpressionBuilder<typeof messageSchema>,
  ) => cmp('senderID', '=', authData.sub ?? ''); */

  return {
    notification: {
      row: {
        insert: ANYONE_CAN,
        update: {
          preMutation: ANYONE_CAN,
        },
        delete: ANYONE_CAN,
      },
    },
    user: {
      row: {
        insert: ANYONE_CAN,
        update: {
          preMutation: ANYONE_CAN,
        },
        delete: ANYONE_CAN,
      },
    },
  };
});

import { Main } from '@/components/Layout/Main';
import { columns } from '@/components/AppAdmin/Users/UsersColumns';
import { UsersDialogs } from '@/components/AppAdmin/Users/UsersDialogs';
import { UsersPrimaryButtons } from '@/components/AppAdmin/Users/UsersPrimaryButtons';
import { UsersTable } from '@/components/AppAdmin/Users/UsersTable';
import UsersProvider from '@/providers/UsersContext';
import { userListSchema } from './Data/schema';
import type { User } from '@/components/AppAdmin/Users/Data/schema'

export default function AppAdminUsers({ users }: { users: User[] }) {
  // Parse user list
  const userList = userListSchema.parse(users)

  return (
    <UsersProvider>
      <Main>
        <div className='mb-2 flex items-center justify-between space-y-2 flex-wrap'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>User List</h2>
            <p className='text-muted-foreground'>
              Manage your users and their roles here.
            </p>
          </div>
          <UsersPrimaryButtons />
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
          <UsersTable data={userList} columns={columns} />
        </div>
      </Main>

      <UsersDialogs />
    </UsersProvider>
  )
}
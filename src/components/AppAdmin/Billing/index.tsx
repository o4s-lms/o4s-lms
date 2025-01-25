import { Main } from '@/components/Layout/Main';
import { columns } from '@/components/AppAdmin/Billing/TransactionsColumns';
import { TransactionsDialogs } from '@/components/AppAdmin/Billing/TransactionsDialogs';
import { TransactionsPrimaryButtons } from '@/components/AppAdmin/Billing/TransactionsPrimaryButtons';
import { TransactionsTable } from '@/components/AppAdmin/Billing/TransactionsTable';
import TransactionsProvider from '@/providers/TransactionsContext';
import { transactionListSchema } from './Data/schema';
import type { Transaction } from '@/components/AppAdmin/Billing/Data/schema';

export default function AppAdminTransactions({
  transactions,
}: {
  transactions: Transaction[];
}) {
  // Parse transaction list
  const transactionList = transactionListSchema.parse(transactions);

  return (
    <TransactionsProvider>
      <Main>
        <div className="mb-2 flex flex-wrap items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Transaction List
            </h2>
            <p className="text-muted-foreground">
              Manage your transactions here.
            </p>
          </div>
          <TransactionsPrimaryButtons />
        </div>
        <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
          <TransactionsTable data={transactionList} columns={columns} />
        </div>
      </Main>

      <TransactionsDialogs />
    </TransactionsProvider>
  );
}

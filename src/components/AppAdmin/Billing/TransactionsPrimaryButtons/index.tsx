'use client';

import { IconTransactionEuro } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { useTransactions } from '@/providers/TransactionsContext';

export function TransactionsPrimaryButtons() {
  const { setOpen } = useTransactions();
  return (
    <div className="flex gap-2">
      <Button className="space-x-1" onClick={() => setOpen('add')}>
        <span>Add Transaction</span> <IconTransactionEuro size={18} />
      </Button>
    </div>
  );
}

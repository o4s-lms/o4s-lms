'use client';

import { useTransactions } from '@/providers/TransactionsContext';
import { TransactionsActionDialog } from '@/components/AppAdmin/Billing/TransactionsActionDialog';
import { TransactionsDeleteDialog } from '@/components/AppAdmin/Billing/TransactionsDeleteDialog';

export function TransactionsDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useTransactions();
  return (
    <>
      <TransactionsActionDialog
        key="transaction-add"
        open={open === 'add'}
        onOpenChange={() => setOpen('add')}
      />

      {currentRow && (
        <>
          <TransactionsActionDialog
            key={`transaction-edit-${currentRow.id}`}
            open={open === 'edit'}
            onOpenChange={() => {
              setOpen('edit');
              setTimeout(() => {
                setCurrentRow(null);
              }, 500);
            }}
            currentRow={currentRow}
          />

          <TransactionsDeleteDialog
            key={`transaction-delete-${currentRow.id}`}
            open={open === 'delete'}
            onOpenChange={() => {
              setOpen('delete');
              setTimeout(() => {
                setCurrentRow(null);
              }, 500);
            }}
            currentRow={currentRow}
          />
        </>
      )}
    </>
  );
}

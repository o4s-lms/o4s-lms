'use client';

import React, { useState } from 'react';
import useDialogState from '@/hooks/use-dialog-state';
import { Transaction } from '@/components/AppAdmin/Billing/Data/schema';

type TransactionsDialogType = 'invite' | 'add' | 'edit' | 'delete'

interface TransactionsContextType {
  open: TransactionsDialogType | null
  setOpen: (str: TransactionsDialogType | null) => void
  currentRow: Transaction | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Transaction | null>>
}

const TransactionsContext = React.createContext<TransactionsContextType | null>(null)

interface Props {
  children: React.ReactNode
}

export default function UsersProvider({ children }: Props) {
  const [open, setOpen] = useDialogState<TransactionsDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Transaction | null>(null)

  return (
    <TransactionsContext value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </TransactionsContext>
  )
}

export const useTransactions = () => {
  const transactionsContext = React.useContext(TransactionsContext)

  if (!transactionsContext) {
    throw new Error('useTransactions has to be used within <TransactionsContext>')
  }

  return transactionsContext
}
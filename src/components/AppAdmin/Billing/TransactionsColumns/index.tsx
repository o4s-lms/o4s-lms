'use client';

import { ColumnDef } from '@tanstack/react-table';
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';
import LongText from '@/components/LongText';
import { statusTypes, transactionProviders } from '../Data/data';
import { Transaction } from '../Data/schema';
import { DataTableColumnHeader } from '@/components/Table/DataTableColumnHeader';
import { DataTableRowActions } from '@/components/AppAdmin/Billing/DataTableRowActions';
import { format } from 'timeago.js';
import { Badge } from '@/components/ui/badge';

export const columns: ColumnDef<Transaction>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    meta: {
      className: cn(
        'sticky md:table-cell left-0 z-10 rounded-tl',
        'bg-background transition-colors duration-200 group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted',
      ),
    },
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'id',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title=" Transaction ID" />
    ),
    cell: ({ row }) => <div className="max-w-36">{row.getValue('id')}</div>,
    meta: {
      className: cn(
        'drop-shadow-[0_1px_2px_rgb(0_0_0_/_0.1)] dark:drop-shadow-[0_1px_2px_rgb(255_255_255_/_0.1)] lg:drop-shadow-none',
        'bg-background transition-colors duration-200 group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted',
        'sticky left-6 md:table-cell',
      ),
    },
    enableHiding: false,
  },
  {
    accessorKey: 'email',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => (
      <div className="w-fit text-nowrap">{row.getValue('email')}</div>
    ),
  },
  {
    id: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {
      const { name } = row.original;
      return <LongText className="max-w-36">{name}</LongText>;
    },
    meta: { className: 'w-36' },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const { status } = row.original;
      const badgeColor = statusTypes.get(status);
      return (
        <div className="flex space-x-2">
          <Badge variant="outline" className={cn('capitalize', badgeColor)}>
            {row.getValue('status')}
          </Badge>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
    enableHiding: false,
    enableSorting: false,
  },
  {
    accessorKey: 'provider',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Provider" />
    ),
    cell: ({ row }) => {
      const { provider } = row.original;
      const transactionProvider = transactionProviders.find(
        ({ value }) => value === provider,
      );

      if (!transactionProvider) {
        return null;
      }

      return (
        <div className="flex items-center gap-x-2">
          {transactionProvider.icon && (
            <transactionProvider.icon
              size={16}
              className="text-muted-foreground"
            />
          )}
          <span className="text-sm capitalize">{row.getValue('provider')}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'total',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Total" />
    ),
    cell: ({ row }) => (
      <div className="w-fit text-nowrap">
        {new Intl.NumberFormat('pt-PT', {
          style: 'currency',
          currency: 'EUR',
        }).format(row.getValue('total') as number / 100)}
      </div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'processed',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Processed" />
    ),
    cell: ({ row }) => {
      const { processed, processedAt } = row.original;
      if (processed) {
        return (
          <div className="w-fit text-nowrap">
            {format(processedAt as Date)}
          </div>
        );
      } else {
        return <div className="w-fit text-nowrap">Not processed</div>;
      }
    },
  },
  {
    id: 'actions',
    cell: DataTableRowActions,
  },
];

'use client';

import * as React from 'react';
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { ArrowUpDown, ChevronDown, MoreHorizontal } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { Transaction } from '@/payload-types';
import { Main } from '@/components/Layout/Main';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';

const cols = () => {

  const columns: ColumnDef<Partial<Transaction>>[] = [
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
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'id',
      header: 'Transaction ID',
      cell: ({ row }) => <div>{row.getValue('id')}</div>,
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue('status')}</div>
      ),
    },
    {
      accessorKey: 'provider',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Provider
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue('provider')}</div>
      ),
    },
    {
      accessorKey: 'courses',
      header: 'Courses',
      cell: ({ row }) => {
        const c = row.original.courses;
        const courses = c
          ?.map(({ value }) => value)
          .filter((course) => typeof course === 'object');
        return (
          <div className="flex items-center">
            <ul>
              {courses?.map((course, index) => (
                <li key={index}>{course.title}</li>
              ))}
            </ul>
          </div>
        );
      },
    },
    {
      accessorKey: 'amount',
      header: () => <div className="text-right">Amount</div>,
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue('amount')) / 100;
  
        // Format the amount as a euro amount
        const formatted = new Intl.NumberFormat('pt-PT', {
          style: 'currency',
          currency: 'EUR',
        }).format(amount);
  
        return <div className="text-right font-medium">{formatted}</div>;
      },
    },
    {
      accessorKey: 'discount',
      header: () => <div className="text-right">Discount</div>,
      cell: ({ row }) => {
        const discount = parseFloat(row.getValue('discount')) / 100;
  
        // Format the amount as a euro amount
        const formatted = new Intl.NumberFormat('pt-PT', {
          style: 'currency',
          currency: 'EUR',
        }).format(discount);
  
        return <div className="text-right font-medium">{formatted}</div>;
      },
    },
    {
      accessorKey: 'tax',
      header: () => <div className="text-right">Tax</div>,
      cell: ({ row }) => {
        const tax = parseFloat(row.getValue('tax')) / 100;
  
        // Format the amount as a euro amount
        const formatted = new Intl.NumberFormat('pt-PT', {
          style: 'currency',
          currency: 'EUR',
        }).format(tax);
  
        return <div className="text-right font-medium">{formatted}</div>;
      },
    },
    {
      accessorKey: 'total',
      header: () => <div className="text-right">Total</div>,
      cell: ({ row }) => {
        const total = parseFloat(row.getValue('total')) / 100;
  
        // Format the amount as a euro amount
        const formatted = new Intl.NumberFormat('pt-PT', {
          style: 'currency',
          currency: 'EUR',
        }).format(total);
  
        return <div className="text-right font-medium">{formatted}</div>;
      },
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        const transaction = row.original;
  
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem asChild>
                <Button
                  onClick={() =>
                    navigator.clipboard.writeText(transaction.id as string)
                  }
                  variant="outline"
                  className="p-4"
                >
                  Copy transaction ID
                </Button>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {transaction.status === 'awaiting' && (
                <>
                  <DropdownMenuItem asChild>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline">Payment instructions</Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Payment instructions:
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            Payment instructions:
                            <Button
                              onClick={async () => {
                                await fetch(
                                  `${process.env.NEXT_PUBLIC_SERVER_URL}/api/functions/emailPaymentInstructions?transactionId=${transaction.id}`,
                                  {
                                    method: 'POST',
                                    credentials: 'include',
                                  },
                                );
                                toast.info(
                                  'Payment instructions sent via email!',
                                );
                              }}
                              variant="outline"
                            >
                              Send payment instructions via email
                            </Button>
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction>Continue</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
              )}
              <DropdownMenuItem asChild>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline">View transaction details</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Transaction details:</AlertDialogTitle>
                      <AlertDialogDescription asChild>
                        <div className="mb-4 flex items-center gap-4">
                          <table>
                            <tbody>
                              <tr>
                                <td>Transaction ID:</td>
                                <td>{transaction.id}</td>
                              </tr>
                              <tr>
                                <td>Buyer name:</td>
                                <td>{transaction.name}</td>
                              </tr>
                              <tr>
                                <td>Buyer email:</td>
                                <td>{transaction.email}</td>
                              </tr>
                              {transaction.provider === 'paypal' && (
                                <tr>
                                  <td>Paypal transaction ID:</td>
                                  <td>{transaction.transactionId}</td>
                                </tr>
                              )}
                              <tr>
                                <td>Amount:</td>
                                <td>
                                  {new Intl.NumberFormat('pt-PT', {
                                    style: 'currency',
                                    currency: 'EUR',
                                  }).format(transaction.amount / 100)}
                                </td>
                              </tr>
                              <tr>
                                <td>Discount:</td>
                                <td>
                                  {new Intl.NumberFormat('pt-PT', {
                                    style: 'currency',
                                    currency: 'EUR',
                                  }).format(transaction.discount / 100)}
                                </td>
                              </tr>
                              <tr>
                                <td>Tax:</td>
                                <td>
                                  {new Intl.NumberFormat('pt-PT', {
                                    style: 'currency',
                                    currency: 'EUR',
                                  }).format(transaction.tax / 100)}
                                </td>
                              </tr>
                              <tr>
                                <td>Total:</td>
                                <td>
                                  {new Intl.NumberFormat('pt-PT', {
                                    style: 'currency',
                                    currency: 'EUR',
                                  }).format(transaction.total / 100)}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return columns;
};

export const columns: ColumnDef<Partial<Transaction>>[] = [
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
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'id',
    header: 'Transaction ID',
    cell: ({ row }) => <div>{row.getValue('id')}</div>,
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue('status')}</div>
    ),
  },
  {
    accessorKey: 'provider',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Provider
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue('provider')}</div>
    ),
  },
  {
    accessorKey: 'courses',
    header: 'Courses',
    cell: ({ row }) => {
      const c = row.original.courses;
      const courses = c
        ?.map(({ value }) => value)
        .filter((course) => typeof course === 'object');
      return (
        <div className="flex items-center">
          <ul>
            {courses?.map((course, index) => (
              <li key={index}>{course.title}</li>
            ))}
          </ul>
        </div>
      );
    },
  },
  {
    accessorKey: 'amount',
    header: () => <div className="text-right">Amount</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('amount')) / 100;

      // Format the amount as a euro amount
      const formatted = new Intl.NumberFormat('pt-PT', {
        style: 'currency',
        currency: 'EUR',
      }).format(amount);

      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: 'discount',
    header: () => <div className="text-right">Discount</div>,
    cell: ({ row }) => {
      const discount = parseFloat(row.getValue('discount')) / 100;

      // Format the amount as a euro amount
      const formatted = new Intl.NumberFormat('pt-PT', {
        style: 'currency',
        currency: 'EUR',
      }).format(discount);

      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: 'tax',
    header: () => <div className="text-right">Tax</div>,
    cell: ({ row }) => {
      const tax = parseFloat(row.getValue('tax')) / 100;

      // Format the amount as a euro amount
      const formatted = new Intl.NumberFormat('pt-PT', {
        style: 'currency',
        currency: 'EUR',
      }).format(tax);

      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: 'total',
    header: () => <div className="text-right">Total</div>,
    cell: ({ row }) => {
      const total = parseFloat(row.getValue('total')) / 100;

      // Format the amount as a euro amount
      const formatted = new Intl.NumberFormat('pt-PT', {
        style: 'currency',
        currency: 'EUR',
      }).format(total);

      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const transaction = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Button
                onClick={() =>
                  navigator.clipboard.writeText(transaction.id as string)
                }
                variant="outline"
                className="p-4"
              >
                Copy transaction ID
              </Button>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {transaction.status === 'awaiting' && (
              <>
                <DropdownMenuItem asChild>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline">Payment instructions</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Payment instructions:
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          Payment instructions:
                          <Button
                            onClick={async () => {
                              await fetch(
                                `${process.env.NEXT_PUBLIC_SERVER_URL}/api/functions/emailPaymentInstructions?transactionId=${transaction.id}&email=${transaction.email}&total=${parseFloat(transaction.total) / 100}`,
                                {
                                  method: 'POST',
                                  credentials: 'include',
                                },
                              );
                              toast.info(
                                'Payment instructions sent via email!',
                              );
                            }}
                            variant="outline"
                          >
                            Send payment instructions via email
                          </Button>
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction>Continue</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </>
            )}
            <DropdownMenuItem asChild>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline">View transaction details</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Transaction details:</AlertDialogTitle>
                    <AlertDialogDescription asChild>
                      <div className="mb-4 flex items-center gap-4">
                        <table>
                          <tbody>
                            <tr>
                              <td>Transaction ID:</td>
                              <td>{transaction.id}</td>
                            </tr>
                            <tr>
                              <td>Buyer name:</td>
                              <td>{transaction.name}</td>
                            </tr>
                            <tr>
                              <td>Buyer email:</td>
                              <td>{transaction.email}</td>
                            </tr>
                            {transaction.provider === 'paypal' && (
                              <tr>
                                <td>Paypal transaction ID:</td>
                                <td>{transaction.transactionId}</td>
                              </tr>
                            )}
                            <tr>
                              <td>Amount:</td>
                              <td>
                                {new Intl.NumberFormat('pt-PT', {
                                  style: 'currency',
                                  currency: 'EUR',
                                }).format(transaction.amount / 100)}
                              </td>
                            </tr>
                            <tr>
                              <td>Discount:</td>
                              <td>
                                {new Intl.NumberFormat('pt-PT', {
                                  style: 'currency',
                                  currency: 'EUR',
                                }).format(transaction.discount / 100)}
                              </td>
                            </tr>
                            <tr>
                              <td>Tax:</td>
                              <td>
                                {new Intl.NumberFormat('pt-PT', {
                                  style: 'currency',
                                  currency: 'EUR',
                                }).format(transaction.tax / 100)}
                              </td>
                            </tr>
                            <tr>
                              <td>Total:</td>
                              <td>
                                {new Intl.NumberFormat('pt-PT', {
                                  style: 'currency',
                                  currency: 'EUR',
                                }).format(transaction.total / 100)}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction>Continue</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export function Billing({ transactions }: { transactions: Transaction[] }) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const data = transactions.map((transaction) => transaction);

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <Main fixed>
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Transactions</CardTitle>
          <CardDescription>Manage your transactions.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex items-center gap-4">
            <Input
              placeholder="Filter providers..."
              value={
                (table.getColumn('provider')?.getFilterValue() as string) ?? ''
              }
              onChange={(event) =>
                table.getColumn('provider')?.setFilterValue(event.target.value)
              }
              className="max-w-sm"
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-auto">
                  Columns <ChevronDown />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) =>
                          column.toggleVisibility(!!value)
                        }
                      >
                        {column.id}
                      </DropdownMenuCheckboxItem>
                    );
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead
                          key={header.id}
                          className="[&:has([role=checkbox])]:pl-3"
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && 'selected'}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell
                          key={cell.id}
                          className="[&:has([role=checkbox])]:pl-3"
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-end space-x-2 pt-4">
            <div className="flex-1 text-sm text-muted-foreground">
              {table.getFilteredSelectedRowModel().rows.length} of{' '}
              {table.getFilteredRowModel().rows.length} row(s) selected.
            </div>
            <div className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </Main>
  );
}

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
import {
  ArrowUpDown,
  Check,
  ChevronDown,
  ChevronsUpDown,
  MoreHorizontal,
} from 'lucide-react';

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
import type { SupportTicket, User } from '@/payload-types';
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { PRIORITY, TICKETS_CATEGORY, TICKETS_STATUS } from '@/lib/constants';
import { cn } from '@/lib/utils';

export const columns: ColumnDef<Partial<SupportTicket>>[] = [
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
    header: 'Ticket ID',
    cell: ({ row }) => <div>{row.getValue('id')}</div>,
  },
  {
    accessorKey: 'category',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Category
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => {
      let category = row.getValue('category');
      return (
        <>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                className={cn(
                  'justify-between',
                  !category && 'text-muted-foreground',
                )}
              >
                {category
                  ? TICKETS_CATEGORY.find(
                      (item) => item.value === category,
                    )?.label
                  : 'Select category'}
                <ChevronsUpDown className="opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <Command>
                <CommandList>
                  <CommandGroup>
                    {TICKETS_CATEGORY.map((item) => (
                      <CommandItem
                        value={item.label}
                        key={item.value}
                        onSelect={async () => {
                          try {
                            await fetch(
                              `${process.env.NEXT_PUBLIC_SERVER_URL}/api/support-tickets/${row.getValue('id')}`,
                              {
                                method: 'PATCH',
                                credentials: "include",
                                headers: {
                                  'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                  category: item.value,
                                }),
                              },
                            );
                            category = item.value;
                          } catch (error) {
                            throw error;
                          }
                        }}
                      >
                        <Check
                          className={cn(
                            'mr-2',
                            item.value === category
                              ? 'opacity-100'
                              : 'opacity-0',
                          )}
                        />
                        {item.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </>
      );
    },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Status
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => {
      let status = row.getValue('status');
      return (
        <>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                className={cn(
                  'justify-between',
                  !status && 'text-muted-foreground',
                )}
              >
                {status
                  ? TICKETS_STATUS.find(
                      (item) => item.value === status,
                    )?.label
                  : 'Select status'}
                <ChevronsUpDown className="opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <Command>
                <CommandList>
                  <CommandGroup>
                    {TICKETS_STATUS.map((item) => (
                      <CommandItem
                        value={item.label}
                        key={item.value}
                        onSelect={async () => {
                          try {
                            await fetch(
                              `${process.env.NEXT_PUBLIC_SERVER_URL}/api/support-tickets/${row.getValue('id')}`,
                              {
                                method: 'PATCH',
                                credentials: "include",
                                headers: {
                                  'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                  status: item.value,
                                }),
                              },
                            );
                            status = item.value;
                          } catch (error) {
                            throw error;
                          }
                        }}
                      >
                        <Check
                          className={cn(
                            'mr-2',
                            item.value === status
                              ? 'opacity-100'
                              : 'opacity-0',
                          )}
                        />
                        {item.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </>
      );
    },
  },
  {
    accessorKey: 'description',
    header: 'Description',
    cell: ({ row }) => <div>{row.getValue('description')}</div>,
  },
  {
    accessorKey: 'recipient',
    header: 'Recipient',
    cell: ({ row }) => {
      const ticket = row.original;
      const user = ticket.user as User;

      return (
        <div>
          {user ? (
            <>
              {user.name} ({user.email})
            </>
          ) : (
            <>
              {ticket.guest?.name} ({ticket.guest?.email})
            </>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: 'priority',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Priority
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => {
      let priority = row.getValue('priority');
      return (
        <>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                className={cn(
                  'justify-between',
                  !priority && 'text-muted-foreground',
                )}
              >
                {priority
                  ? PRIORITY.find(
                      (item) => item.value === priority,
                    )?.label
                  : 'Select priority'}
                <ChevronsUpDown className="opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <Command>
                <CommandList>
                  <CommandGroup>
                    {PRIORITY.map((item) => (
                      <CommandItem
                        value={item.label}
                        key={item.value}
                        onSelect={async () => {
                          try {
                            await fetch(
                              `${process.env.NEXT_PUBLIC_SERVER_URL}/api/support-tickets/${row.getValue('id')}`,
                              {
                                method: 'PATCH',
                                credentials: "include",
                                headers: {
                                  'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                  priority: item.value,
                                }),
                              },
                            );
                            priority = item.value;
                          } catch (error) {
                            throw error;
                          }
                        }}
                      >
                        <Check
                          className={cn(
                            'mr-2',
                            item.value === priority
                              ? 'opacity-100'
                              : 'opacity-0',
                          )}
                        />
                        {item.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </>
      );
    },
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const ticket = row.original;
      const user = ticket.user as User;

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
                  navigator.clipboard.writeText(ticket.id as string)
                }
                variant="outline"
                className="p-4"
              >
                Copy ticket ID
              </Button>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {ticket.status === 'new' && (
              <>
                <DropdownMenuItem asChild>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline">Reply</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Reply:</AlertDialogTitle>
                        <AlertDialogDescription>
              
                              <Button
                                onClick={async () => {
                                  await fetch(
                                    `${process.env.NEXT_PUBLIC_SERVER_URL}/api/functions/emailPaymentInstructions?transactionId=${ticket.id}`,
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
                  <Button variant="outline">View ticket details</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Ticket details:</AlertDialogTitle>
                    <AlertDialogDescription asChild>
                      <div className="mb-4 flex items-center gap-4">
                        <table>
                          <tbody>
                            <tr>
                              <td>Ticket ID:</td>
                              <td>{ticket.id}</td>
                            </tr>
                            <tr>
                              <td>Status:</td>
                              <td className="capitalize">{ticket.status}</td>
                            </tr>
                            <tr>
                              <td>Description:</td>
                              <td>{ticket.description}</td>
                            </tr>
                            {user ? (
                              <>
                                <tr>
                                  <td>User Name:</td>
                                  <td>{user.name}</td>
                                </tr>
                                <tr>
                                  <td>User Email:</td>
                                  <td>{user.email}</td>
                                </tr>
                              </>
                            ) : (
                              <>
                                <tr>
                                  <td>Guest Name:</td>
                                  <td>{ticket.guest?.name}</td>
                                </tr>
                                <tr>
                                  <td>Guest Email:</td>
                                  <td>{ticket.guest?.email}</td>
                                </tr>
                              </>
                            )}
                            <tr>
                              <td>Priority:</td>
                              <td className="capitalize">{ticket.priority}</td>
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

export function AppAdminSupport({ tickets }: { tickets: SupportTicket[] }) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const data = tickets.map((ticket) => ticket);

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
      columnVisibility: {
        id: false,
      },
      rowSelection,
    },
  });

  return (
    <Main fixed>
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Support Tickets</CardTitle>
          <CardDescription>Manage all support tickets.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex items-center gap-4">
            <Input
              placeholder="Filter status..."
              value={
                (table.getColumn('status')?.getFilterValue() as string) ?? ''
              }
              onChange={(event) =>
                table.getColumn('status')?.setFilterValue(event.target.value)
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

'use client';

import * as React from 'react';
import {
  ColumnDef,
  ColumnFiltersState,
  RowData,
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

declare module '@tanstack/react-table' {
  interface TableMeta<TData extends RowData> {
    updateData: (rowIndex: number, columnId: string, value: unknown) => void;
  }
}

const Cols = () => {
  const columns: ColumnDef<Partial<SupportTicket>>[] = [
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
      cell: ({ getValue, row, column: { id }, table }) => {
        const initialValue = getValue();
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const [value, setValue] = React.useState(initialValue);

        // eslint-disable-next-line react-hooks/rules-of-hooks
        React.useEffect(() => {
          setValue(initialValue);
        }, [initialValue]);

        const onBlur = () => {
          table.options.meta?.updateData(row.index, id, value);
        };

        return (
          <>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  className={cn(
                    'justify-between',
                    !value && 'text-muted-foreground',
                  )}
                >
                  {value
                    ? TICKETS_CATEGORY.find((item) => item.value === value)
                        ?.label
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
                                  credentials: 'include',
                                  headers: {
                                    'Content-Type': 'application/json',
                                  },
                                  body: JSON.stringify({
                                    category: item.value,
                                  }),
                                },
                              );
                              setValue(item.value);
                              void onBlur();
                            } catch (error) {
                              throw error;
                            }
                          }}
                        >
                          <Check
                            className={cn(
                              'mr-2',
                              item.value === value
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
      cell: ({ getValue, row, column: { id }, table }) => {
        const initialValue = getValue();
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const [value, setValue] = React.useState(initialValue);

        // eslint-disable-next-line react-hooks/rules-of-hooks
        React.useEffect(() => {
          setValue(initialValue);
        }, [initialValue]);

        const onBlur = () => {
          table.options.meta?.updateData(row.index, id, value);
        };
        return (
          <>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  className={cn(
                    'justify-between',
                    !value && 'text-muted-foreground',
                  )}
                >
                  {value
                    ? TICKETS_STATUS.find((item) => item.value === value)?.label
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
                                  credentials: 'include',
                                  headers: {
                                    'Content-Type': 'application/json',
                                  },
                                  body: JSON.stringify({
                                    status: item.value,
                                  }),
                                },
                              );
                              setValue(item.value);
                              void onBlur();
                            } catch (error) {
                              throw error;
                            }
                          }}
                        >
                          <Check
                            className={cn(
                              'mr-2',
                              item.value === value
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
      cell: ({ getValue, row, column: { id }, table }) => {
        //const priority = row.getValue('priority');
        const initialValue = getValue();
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const [value, setValue] = React.useState(initialValue);

        // eslint-disable-next-line react-hooks/rules-of-hooks
        React.useEffect(() => {
          setValue(initialValue);
        }, [initialValue]);

        const onBlur = () => {
          table.options.meta?.updateData(row.index, id, value);
        };

        return (
          <>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  className={cn(
                    'justify-between',
                    !value && 'text-muted-foreground',
                  )}
                >
                  {value
                    ? PRIORITY.find((item) => item.value === value)?.label
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
                                  credentials: 'include',
                                  headers: {
                                    'Content-Type': 'application/json',
                                  },
                                  body: JSON.stringify({
                                    priority: item.value,
                                  }),
                                },
                              );
                              setValue(item.value);
                              void onBlur();
                            } catch (error) {
                              throw error;
                            }
                          }}
                        >
                          <Check
                            className={cn(
                              'mr-2',
                              item.value === value
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
                                <td>Category:</td>
                                <td className="capitalize">
                                  {ticket.category}
                                </td>
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
                                <td className="capitalize">
                                  {ticket.priority}
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

export function AppAdminSupport({ tickets }: { tickets: SupportTicket[] }) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [data, setData] = React.useState(tickets);

  const columns = React.useMemo(() => Cols(), []);

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
    meta: {
      updateData: (rowIndex, columnId, value) => {
        // Skip page index reset until after next rerender
        //skipAutoResetPageIndex()
        setData((old) =>
          old.map((row, index) => {
            if (index === rowIndex) {
              return {
                ...old[rowIndex]!,
                [columnId]: value,
              };
            }
            return row;
          }),
        );
      },
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

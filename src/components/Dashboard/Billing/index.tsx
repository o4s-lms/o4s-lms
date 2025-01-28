'use client';

import * as React from 'react';
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
import { Drawer } from 'vaul';
import type { Transaction } from '@/payload-types';
import { Main } from '@/components/Layout/Main';
import { toast } from 'sonner';
import { DotFilledIcon, DotsVerticalIcon } from '@radix-ui/react-icons';
import { fromNow } from '@/lib/utils';
import { Invoice } from './Invoice';
import { fetcher } from '@/lib/fetcher';

export function Billing({ transactions }: { transactions: Transaction[] }) {
  const data = transactions.map((transaction) => transaction);

  return (
    <Main fixed>
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Transactions</CardTitle>
          <CardDescription>Manage your transactions.</CardDescription>
        </CardHeader>
        <CardContent>
          <ul role="list" className="divide-y divide-gray-100 px-5">
            {data.map((item) => (
              <li key={item.id} className="flex justify-between gap-x-6 py-5">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-5">
                    <h3 className="text-xl font-bold leading-6 text-gray-600">
                      {item.id}
                    </h3>
                    <span
                      className={`tex-sm rounded border px-2 ${
                        item.status === 'completed'
                          ? 'border-green-300 bg-green-50 text-green-700'
                          : item.status === 'awaiting'
                            ? 'border-gray-300 bg-gray-50 text-gray-700'
                            : 'border-orange-300 bg-orange-50 text-orange-700'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    {item.processedAt && (
                      <>
                        <p className="text-sm text-gray-400">
                          Processed at {fromNow(item.processedAt, 'pt')}
                        </p>
                        <DotFilledIcon className="text-sm text-gray-400" />
                      </>
                    )}
                    <p className="text-sm text-gray-400">
                      Created at {fromNow(item.createdAt, 'pt')} -{' '}
                      {item.provider}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <p className="text-sm text-gray-400">
                      Amount:{' '}
                      {new Intl.NumberFormat('pt-PT', {
                        style: 'currency',
                        currency: 'EUR',
                      }).format(item.amount / 100)}
                    </p>
                    <DotFilledIcon className="text-sm text-gray-400" />
                    <p className="text-sm text-gray-400">
                      Discount:{' '}
                      {new Intl.NumberFormat('pt-PT', {
                        style: 'currency',
                        currency: 'EUR',
                      }).format(item.discount / 100)}
                    </p>
                    <DotFilledIcon className="text-sm text-gray-400" />
                    <p className="text-sm text-gray-400">
                      Tax:{' '}
                      {new Intl.NumberFormat('pt-PT', {
                        style: 'currency',
                        currency: 'EUR',
                      }).format(item.tax / 100)}
                    </p>
                    <DotFilledIcon className="text-sm text-gray-400" />
                    <p className="text-sm text-gray-400">
                      Total:{' '}
                      {new Intl.NumberFormat('pt-PT', {
                        style: 'currency',
                        currency: 'EUR',
                      }).format(item.total / 100)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-5">
                  <div className="hidden shrink-0 sm:flex">
                    {item.status === 'completed' && (
                      <Drawer.Root direction="right">
                        <Drawer.Trigger asChild>
                          <Button variant="outline">View invoice</Button>
                        </Drawer.Trigger>
                        <Drawer.Portal>
                          <Drawer.Overlay className="fixed inset-0 bg-black/40" />
                          <Drawer.Content
                            className="fixed bottom-2 right-2 top-2 z-10 flex outline-none"
                            // The gap between the edge of the screen and the drawer is 8px in this case.
                            style={
                              {
                                '--initial-transform': 'calc(100% + 8px)',
                              } as React.CSSProperties
                            }
                          >
                            <div className="bg-white p-4">
                              <Invoice transaction={item} />
                            </div>
                          </Drawer.Content>
                        </Drawer.Portal>
                      </Drawer.Root>
                    )}
                    {item.status === 'awaiting' && (
                      <Drawer.Root direction="right">
                        <Drawer.Trigger asChild>
                          <Button variant="outline">
                            Payment instructions
                          </Button>
                        </Drawer.Trigger>
                        <Drawer.Portal>
                          <Drawer.Overlay className="fixed inset-0 bg-black/40" />
                          <Drawer.Content
                            className="fixed bottom-2 right-2 top-2 z-10 flex outline-none"
                            // The gap between the edge of the screen and the drawer is 8px in this case.
                            style={
                              {
                                '--initial-transform': 'calc(100% + 8px)',
                              } as React.CSSProperties
                            }
                          >
                            <div className="bg-white p-4">
                              <Drawer.Title className="mb-4 font-medium text-gray-900">
                                Payment instructions
                              </Drawer.Title>

                              <Button
                                onClick={async () => {
                                  await fetcher(
                                    `/api/functions/emailPaymentInstructions?transactionId=${item.id}`,
                                    {
                                      method: 'POST',
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
                            </div>
                          </Drawer.Content>
                        </Drawer.Portal>
                      </Drawer.Root>
                    )}
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <DotsVerticalIcon />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-28">
                      <DropdownMenuItem>
                        <span>Edit</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <span>Move</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <span>Delete</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </Main>
  );
}

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
          <ul role="list" className="px-5 divide-y divide-gray-100">
            {data.map((item) => (
              <li key={item.id} className="flex justify-between gap-x-6 py-5">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-5">
                    <h3 className="text-xl font-bold leading-6 text-gray-600">
                      {item.id}
                    </h3>
                    <span
                      className={`px-2 border tex-sm rounded ${item.status === "completed"
                        ? "border-green-300 text-green-700 bg-green-50"
                        : item.status === "awaiting"
                          ? "border-gray-300 text-gray-700 bg-gray-50"
                          : "border-orange-300 text-orange-700 bg-orange-50"
                        }`}
                    >
                      {item.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    {item.processedAt && (
                      <>
                        <p className="text-gray-400 text-sm">Processed at {fromNow(item.processedAt, 'pt')}</p>
                        <DotFilledIcon className="text-gray-400 text-sm" />
                      </>
                    )}
                    <p className="text-gray-400 text-sm">Created at {fromNow(item.createdAt, 'pt')} - {item.provider}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <p className="text-gray-400 text-sm">Amount: {new Intl.NumberFormat('pt-PT', {
                      style: 'currency',
                      currency: 'EUR',
                    }).format(item.amount / 100)}</p>
                    <DotFilledIcon className="text-gray-400 text-sm" />
                    <p className="text-gray-400 text-sm">Discount: {new Intl.NumberFormat('pt-PT', {
                      style: 'currency',
                      currency: 'EUR',
                    }).format(item.discount / 100)}</p>
                    <DotFilledIcon className="text-gray-400 text-sm" />
                    <p className="text-gray-400 text-sm">Tax: {new Intl.NumberFormat('pt-PT', {
                      style: 'currency',
                      currency: 'EUR',
                    }).format(item.tax / 100)}</p>
                    <DotFilledIcon className="text-gray-400 text-sm" />
                    <p className="text-gray-400 text-sm">Total: {new Intl.NumberFormat('pt-PT', {
                      style: 'currency',
                      currency: 'EUR',
                    }).format(item.total / 100)}</p>
                  </div>
                </div>
                <div className="items-end flex items-center gap-5">
                  <div className="hidden shrink-0 sm:flex">
                    {item.status === "completed" && (
                      <Drawer.Root direction="right">
                        <Drawer.Trigger asChild>
                          <Button variant="outline">View invoice</Button>
                        </Drawer.Trigger>
                        <Drawer.Portal>
                          <Drawer.Overlay className="fixed inset-0 bg-black/40" />
                          <Drawer.Content
                            className="right-2 top-2 bottom-2 fixed z-10 outline-none flex"
                            // The gap between the edge of the screen and the drawer is 8px in this case.
                            style={{ '--initial-transform': 'calc(100% + 8px)' } as React.CSSProperties}
                          >
                            <div className="p-4 bg-white"><Invoice transaction={item} /></div>
                          </Drawer.Content>
                        </Drawer.Portal>
                      </Drawer.Root>
                    )}
                    {item.status === "awaiting" && (
                      <Drawer.Root direction="right">
                        <Drawer.Trigger asChild>
                          <Button variant="outline">Payment instructions</Button>
                        </Drawer.Trigger>
                        <Drawer.Portal>
                          <Drawer.Overlay className="fixed inset-0 bg-black/40" />
                          <Drawer.Content
                            className="right-2 top-2 bottom-2 fixed z-10 outline-none flex"
                            // The gap between the edge of the screen and the drawer is 8px in this case.
                            style={{ '--initial-transform': 'calc(100% + 8px)' } as React.CSSProperties}
                          >
                            <div className="p-4 bg-white">
                              <Drawer.Title className="font-medium mb-4 text-gray-900">Payment instructions</Drawer.Title>
                              
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

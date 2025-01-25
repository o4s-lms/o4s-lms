import { Logo } from '@/components/Brand/logo';
import { Transaction } from '@/payload-types';
import React from 'react';
import { useTranslate } from '@tolgee/react';

export const Invoice = ({ transaction }: { transaction: Transaction }) => {
  const { t } = useTranslate();

  const c = transaction.courses;
  const courses = c
    ?.map(({ value }) => value)
    .filter((course) => typeof course === 'object');

  return (
    <div className="mx-auto max-w-xl rounded-lg bg-white px-8 py-10 shadow-lg">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center">
          <Logo className="mr-2 h-8 w-8" />
          <div className="text-lg font-semibold text-gray-700">
            José Cordeiro - NIF: 123456789
          </div>
        </div>
        <div className="text-gray-700">
          <div className="mb-2 text-xl font-bold">INVOICE</div>
          <div className="text-sm">Date: {transaction.processedAt}</div>
          <div className="text-sm">Invoice #: INV12345</div>
        </div>
      </div>
      <div className="mb-8 border-b-2 border-gray-300 pb-8">
        <h2 className="mb-4 text-2xl font-bold">Bill To:</h2>
        <div className="mb-2 text-gray-700">{transaction.name}</div>
        <div className="text-gray-700">{transaction.email}</div>
      </div>
      <table className="mb-8 w-full text-left">
        <thead>
          <tr>
            <th className="py-2 font-bold uppercase text-gray-700">
              Description
            </th>
            <th className="py-2 font-bold uppercase text-gray-700">Quantity</th>
            <th className="py-2 font-bold uppercase text-gray-700">Price</th>
            <th className="py-2 font-bold uppercase text-gray-700">Total</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((course) => (
            <tr key={course.id}>
              <td className="py-4 text-gray-700">{course.title}</td>
              <td className="py-4 text-gray-700">1</td>
              <td className="py-4 text-gray-700">
                {new Intl.NumberFormat('pt-PT', {
                  style: 'currency',
                  currency: 'EUR',
                }).format(course.price / 100)}
              </td>
              <td className="py-4 text-gray-700">
                {new Intl.NumberFormat('pt-PT', {
                  style: 'currency',
                  currency: 'EUR',
                }).format(course.price / 100)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mb-8 flex justify-end">
        <div className="mr-2 text-gray-700">Subtotal:</div>
        <div className="text-gray-700">
          {new Intl.NumberFormat('pt-PT', {
            style: 'currency',
            currency: 'EUR',
          }).format(transaction.amount / 100)}
        </div>
      </div>
      {transaction.discount > 0 && (
        <div className="mb-8 flex justify-end">
          <div className="mr-2 text-gray-700">Discount:</div>
          <div className="text-xl font-bold text-gray-700">
            {new Intl.NumberFormat('pt-PT', {
              style: 'currency',
              currency: 'EUR',
            }).format(transaction.discount / 100)}
          </div>
        </div>
      )}
      <div className="mb-8 flex justify-end">
        <div className="mr-2 text-gray-700">Tax:</div>
        <div className="text-gray-700">
          {new Intl.NumberFormat('pt-PT', {
            style: 'currency',
            currency: 'EUR',
          }).format(transaction.tax / 100)}
        </div>
      </div>
      <div className="mb-8 flex justify-end">
        <div className="mr-2 text-gray-700">Total:</div>
        <div className="text-xl font-bold text-gray-700">
          {new Intl.NumberFormat('pt-PT', {
            style: 'currency',
            currency: 'EUR',
          }).format(transaction.total / 100)}
        </div>
      </div>
      <div className="mb-8 border-t-2 border-gray-300 pt-8">
        <div className="mb-2 text-gray-700">
          Transaction {transaction.id} - {transaction.provider}.
        </div>
        <div className="text-gray-700">Abrantes, Portugal</div>
      </div>
    </div>
  );
};

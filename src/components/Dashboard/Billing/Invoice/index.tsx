import { Logo } from "@/components/Brand/logo";
import { Transaction } from "@/payload-types";
import React from "react";

export const Invoice = ({ transaction }: { transaction: Transaction }) => {

  const c = transaction.courses;
  const courses = c
    ?.map(({ value }) => value)
    .filter((course) => typeof course === 'object');

  return (
    <div className="bg-white rounded-lg shadow-lg px-8 py-10 max-w-xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <Logo className="h-8 w-8 mr-2" />
          <div className="text-gray-700 font-semibold text-lg">
            José Cordeiro
          </div>
        </div>
        <div className="text-gray-700">
          <div className="font-bold text-xl mb-2">INVOICE</div>
          <div className="text-sm">Date: {transaction.processedAt}</div>
          <div className="text-sm">Invoice #: INV12345</div>
        </div>
      </div>
      <div className="border-b-2 border-gray-300 pb-8 mb-8">
        <h2 className="text-2xl font-bold mb-4">Bill To:</h2>
        <div className="text-gray-700 mb-2">{transaction.name}</div>
        <div className="text-gray-700">{transaction.email}</div>
      </div>
      <table className="w-full text-left mb-8">
        <thead>
          <tr>
            <th className="text-gray-700 font-bold uppercase py-2">
              Description
            </th>
            <th className="text-gray-700 font-bold uppercase py-2">Quantity</th>
            <th className="text-gray-700 font-bold uppercase py-2">Price</th>
            <th className="text-gray-700 font-bold uppercase py-2">Total</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((course) => (
            <tr key={course.id}>
              <td className="py-4 text-gray-700">{course.title}</td>
              <td className="py-4 text-gray-700">1</td>
              <td className="py-4 text-gray-700">{new Intl.NumberFormat('pt-PT', {
                style: 'currency',
                currency: 'EUR',
              }).format(course.price / 100)}</td>
              <td className="py-4 text-gray-700">{new Intl.NumberFormat('pt-PT', {
                style: 'currency',
                currency: 'EUR',
              }).format(course.price / 100)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-end mb-8">
        <div className="text-gray-700 mr-2">Subtotal:</div>
        <div className="text-gray-700">{new Intl.NumberFormat('pt-PT', {
          style: 'currency',
          currency: 'EUR',
        }).format(transaction.amount / 100)}</div>
      </div>
      {transaction.discount > 0 && (
        <div className="flex justify-end mb-8">
        <div className="text-gray-700 mr-2">Discount:</div>
        <div className="text-gray-700 font-bold text-xl">{new Intl.NumberFormat('pt-PT', {
          style: 'currency',
          currency: 'EUR',
        }).format(transaction.discount / 100)}</div>
      </div>
      )}
      <div className="flex justify-end mb-8">
        <div className="text-gray-700 mr-2">Tax:</div>
        <div className="text-gray-700">{new Intl.NumberFormat('pt-PT', {
          style: 'currency',
          currency: 'EUR',
        }).format(transaction.tax / 100)}</div>
      </div>
      <div className="flex justify-end mb-8">
        <div className="text-gray-700 mr-2">Total:</div>
        <div className="text-gray-700 font-bold text-xl">{new Intl.NumberFormat('pt-PT', {
          style: 'currency',
          currency: 'EUR',
        }).format(transaction.total / 100)}</div>
      </div>
      <div className="border-t-2 border-gray-300 pt-8 mb-8">
        <div className="text-gray-700 mb-2">
          Transaction {transaction.id} - {transaction.provider}.
        </div>
        <div className="text-gray-700">Abrantes, Portugal</div>
      </div>
    </div>
  );
};
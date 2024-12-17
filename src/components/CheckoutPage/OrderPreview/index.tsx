import { formatPrice } from '@/lib/utils';
import { Course } from '@/payload-types';
import React from 'react';

export type CourseOrderData = Pick<Course, 'id' | 'title' | 'price'>;

interface CoursePreviewProps {
  courses: CourseOrderData[];
  discount: number;
}

const OrderPreview = ({ courses, discount }: CoursePreviewProps) => {
  let price = 0;
  return (
    <div className="space-y-10">
      <div className="w-full bg-customgreys-secondarybg py-8 px-10 flex flex-col gap-5 rounded-lg">
        <h3 className="mb-4 text-xl">Price Details (1 item)</h3>
        <ul className="text-customgreys-dirtyGrey mb-4 flex justify-between text-base">
          {courses.map((course, i) => {
            price += course.price;
            return (
              <li key={i}>
                <span className="font-bold">1x {course.title}</span>
                <span className="font-bold">{formatPrice(course.price)}</span>
              </li>
            );
          })}
        </ul>
        <div className="border-customgreys-dirtyGrey flex justify-between border-t pt-4">
          <span className="text-lg font-bold">Discount</span>
          <span className="text-lg font-bold">{formatPrice(discount)}</span>
        </div>
        <div className="border-customgreys-dirtyGreygre flex justify-between border-t pt-4">
          <span className="text-lg font-bold">Total Amount</span>
          <span className="text-lg font-bold">
            {formatPrice(price - discount)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default OrderPreview;

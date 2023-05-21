import { ReactNode } from "react";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import Balancer from "react-wrap-balancer";

export default function CourseCard({
  name,
  description,
	image,
	large
}: {
  name: string;
  description: string;
  image: string;
  large?: boolean;
}) {
  return (
    <div
      className={`relative col-span-1 h-96 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md ${
        large ? "md:col-span-2" : ""
      }`}
    >
      <div className="flex h-60 items-center justify-center">
				<Image src={image} alt={name} width={240} height={240} />
			</div>
      <div className="mx-auto max-w-md text-center">
        <h2 className="bg-gradient-to-br from-black to-stone-500 bg-clip-text font-display text-xl font-bold text-transparent md:text-3xl md:font-normal">
          <Balancer>{name}</Balancer>
        </h2>
        <div className="prose-sm -mt-2 leading-normal text-gray-500 md:prose">
          <Balancer>
              {description}
          </Balancer>
        </div>
      </div>
    </div>
  );
}
"use client"

import { useRef, useState } from "react"
import { createClient } from "@o4s/generated-wundergraph/client"

import SectionWrapper from "@/components/section-wrapper";
import { SiteGet_faqsResponseData } from "@o4s/generated-wundergraph/models";

const client = createClient()

type Faq = SiteGet_faqsResponseData["faqs"][number]
interface FaqCard {
	idx: number
	item: Faq
}

const FaqsCard: React.FC<FaqCard> = ({ idx, item }) => {
  const answerElRef = useRef();
  const [state, setState] = useState(false);
  const [answerH, setAnswerH] = useState("0px");

  const handleOpenAnswer = () => {
    const answerElH = answerElRef.current.childNodes[0].offsetHeight;
    setState(!state);
    setAnswerH(`${answerElH + 20}px`);
  };

  return (
    <div
      className="mt-5 space-y-3 overflow-hidden border-b"
      key={idx}
      onClick={handleOpenAnswer}
    >
      <h4 className="flex cursor-pointer items-center justify-between pb-5 text-lg font-medium text-gray-700 dark:text-gray-400">
        {item.question}
        {state ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="ml-2 h-5 w-5 text-gray-500 dark:text-gray-200"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M20 12H4"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="ml-2 h-5 w-5 text-gray-500 dark:text-gray-200"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
        )}
      </h4>
      <div
        ref={answerElRef}
        className="duration-300"
        style={state ? { height: answerH } : { height: "0px" }}
      >
        <div
          className="text-gray-500 dark:text-gray-200"
          dangerouslySetInnerHTML={{ __html: item.answer }}
        />
      </div>
    </div>
  );
};

const FAQS = async () => {
	const { data, error } = await client.query({
		operationName: 'site/get-faqs',
		input: {
			locale: 'pt'
		}
	})
  
  return (
    <SectionWrapper>
      <div className="custom-screen">
				{data?.faqs ? (
					<div className="mx-auto mt-14 max-w-2xl">
						{data?.faqs.map((item, idx) => (
							<FaqsCard idx={idx} item={item} />
						))}
					</div>
				) : (
					<div><p>Não existem perguntas frequentes disponíveis</p></div>
				)}
      </div>
    </SectionWrapper>
  )
}

export default FAQS
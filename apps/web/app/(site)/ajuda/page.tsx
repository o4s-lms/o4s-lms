import Head from "next/head"
import FAQS from "../components/faqs"
import Pricing from "../components/pricing"
import GradientWrapper from "@/components/gradient-wrapper"
import { Metadata } from "next/types"

export const metadata: Metadata = {
  title: "Ajuda - Perguntas Frequentes",
  description: "Open Source Learning Managment System.",
}

export default function Ajuda() {
  return (
    <>
			<GradientWrapper>
        <section>
          <div className="custom-screen text-gray-600 sm:text-center">
            <div className="max-w-4xl space-y-5 sm:mx-auto">
              <h1 className="text-4xl font-extrabold text-white sm:text-6xl">
								Ajuda / Perguntas Frequentes
              </h1>
							<p className="mx-auto max-w-lg text-lg text-gray-600 dark:text-gray-300">
								Se precisa de ajuda, por favor, leia a lista de perguntas mais
								frequentes. Contate-nos se ainda tiver dúvidas.
							</p>
            </div>
          </div>
        </section>
      </GradientWrapper>
      <FAQS />
      <Pricing />
    </>
  );
}

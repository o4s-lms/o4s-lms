import Link from "next/link"

import SectionWrapper from "@/components/section-wrapper"
import { ProductCardGrid } from "./product-card-grid"
import { Loading } from "@/components/loading"
import { createClient } from "@o4s/generated-wundergraph/client"

const client = createClient({
  customFetch: fetch,
})

const Products = async () => {
	const { data, error } = await client.query({
		operationName: 'products/all',
		input: {
			locale: 'pt'
		}
	})

    return (
        <SectionWrapper>
            <div className="custom-screen text-gray-600 dark:text-gray-300">
                <div className="max-w-xl space-y-3">
                    <h2 className="text-3xl font-semibold text-gray-800 dark:text-gray-50 sm:text-4xl">
                        Inicia a tua viagem rumo à sustentabilidade
                    </h2>
                    <p>
										A nossa filosofia é que todo o conhecimento pertinente ao tema da sustentabilidade deva ser disseminado pelo maior número de pessoas possível. É por isto que o nosso maior objetivo é promover a educação para a sustentabilidade.{" "}
                        <Link href="/cursos" className="inline-flex items-center gap-x-1 text-blue-600 duration-150 hover:text-blue-400 dark:text-sky-500 dark:hover:text-sky-600">
                            Ver detalhes
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
                                <path fillRule="evenodd" d="M2 10a.75.75 0 01.75-.75h12.59l-2.1-1.95a.75.75 0 111.02-1.1l3.5 3.25a.75.75 0 010 1.1l-3.5 3.25a.75.75 0 11-1.02-1.1l2.1-1.95H2.75A.75.75 0 012 10z" clipRule="evenodd" />
                            </svg>
                        </Link>
                    </p>
                </div>
								{data?.products ? (
                <div className="mt-12">
									{data?.products ? (
                    <ul className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
                        {
                            data?.products?.map((item, idx) => (
                                <li key={idx}>
                                    <ProductCardGrid idx={idx} item={item} />
                                </li>
                            ))
                        }
                    </ul>
									) : (
										<div><p>Não existem produtos disponíveis... A carregar</p></div>
									)}
                </div>
								) : (
									<Loading />
								)}
            </div>
        </SectionWrapper>
    )
}

export default Products
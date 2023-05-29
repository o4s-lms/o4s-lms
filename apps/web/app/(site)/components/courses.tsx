import Link from "next/link"
import { useSWRConfig } from "swr"
import SectionWrapper from "@/components/section-wrapper"
import { useQuery } from "@/lib/wundergraph"
import { CourseCardGrid } from "./course-card-grid"

const Courses = () => {
	const { mutate } = useSWRConfig();
	const { data } = useQuery({
		operationName: 'site/get-courses',
		input: {
			locale: 'pt'
		}
	})
	const courses = data?.courses

    return (
        <SectionWrapper>
            <div className="custom-screen text-gray-600 dark:text-gray-300">
                <div className="max-w-xl space-y-3">
                    <h2 className="text-3xl font-semibold text-gray-800 dark:text-gray-50 sm:text-4xl">
                        Inicia a tua viagem rumo à sustentabilidade
                    </h2>
                    <p>
										A nossa filosofia é que todo o conhecimento pertinente ao tema da sustentabilidade deva ser disseminado pelo maior número de pessoas possível. É por isto que o nosso maior objetivo é promover a educação para a sustentabilidade.{" "}
                        <Link href="/cursos/sustentabilidade" className="inline-flex items-center gap-x-1 text-blue-600 duration-150 hover:text-blue-400 dark:text-sky-500 dark:hover:text-sky-600">
                            Ver detalhes
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
                                <path fillRule="evenodd" d="M2 10a.75.75 0 01.75-.75h12.59l-2.1-1.95a.75.75 0 111.02-1.1l3.5 3.25a.75.75 0 010 1.1l-3.5 3.25a.75.75 0 11-1.02-1.1l2.1-1.95H2.75A.75.75 0 012 10z" clipRule="evenodd" />
                            </svg>
                        </Link>
                    </p>
                </div>
                <div className="mt-12">
									{courses ? (
                    <ul className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
                        {
                            courses?.map((item, idx) => (
                                <li key={idx}>
                                    <CourseCardGrid idx={idx} item={item} />
                                </li>
                            ))
                        }
                    </ul>
									) : (
										<div><p>Não existem cursos disponíveis</p></div>
									)}
                </div>
            </div>
        </SectionWrapper>
    )
}

export default Courses
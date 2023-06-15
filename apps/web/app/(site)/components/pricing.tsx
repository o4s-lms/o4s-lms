import GradientWrapper from "@/components/gradient-wrapper"
import { Button } from "@/components/ui/button"
import { PricingSection } from "./pricing-section"

const Pricing = () => {
    return (
        <GradientWrapper className="overflow-hidden dark:my-0 dark:overflow-visible sm:my-16">
            <div className="custom-screen justify-between gap-12 md:flex">
                <div className='relative max-w-2xl text-gray-300'>
                    <h2 className='text-3xl font-semibold text-gray-50 sm:text-4xl'>
                        Inicia a tua jornada
                    </h2>
                    <p>
											O desafio é criar uma sociedade sustentável, justa e pacífica, em harmonia com toda a terra e vida. Implica uma sensibilidade ecológica e um profundo respeito, tanto pelas culturas indígenas como pelas modernas, e também para com a diversidade das formas vidas na Terra.
                    </p>
                </div>
								
                <div className="mt-12 rounded-xl bg-white shadow-lg dark:bg-gray-900/50 md:mt-0">
                    <div className="h-full space-y-3 p-6">
											
											{/**<div className="flex flex-wrap items-center justify-between gap-3">
                            <span className="text-2xl font-semibold text-gray-800 dark:text-gray-50">
                                Preços desde
                            </span>
                            <div className="text-2xl font-semibold text-gray-800 dark:text-gray-50">
                                €35
                            </div>
                        </div>
                        <p className="max-w-sm text-gray-600 dark:text-gray-300">
													Integra uma vasta gama de ferramentas online de aprendizagem.
                        </p>
                        <Button className="block w-full bg-blue-600 text-white shadow ring-blue-600 ring-offset-2 hover:bg-blue-500 focus:ring dark:bg-sky-500 dark:ring-sky-500 dark:hover:bg-sky-600">
                            Começa agora!
                        </Button>*/}
                    </div>
                </div>
            </div>
						<PricingSection />
        </GradientWrapper>
    )
}

export default Pricing
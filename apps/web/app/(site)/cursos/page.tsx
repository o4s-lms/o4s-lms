import GradientWrapper from "@/components/gradient-wrapper";
import SectionWrapper from "@/components/section-wrapper";

export function Cursos() {
	return (
    <>
      <GradientWrapper>
        <section>
          <div className='custom-screen text-gray-600 sm:text-center'>
            <div className='max-w-4xl space-y-5 sm:mx-auto'>
              <h1 className='text-4xl font-extrabold text-white sm:text-6xl'>
									A Sustentabilidade requer uma mudança. Nos valores, atitudes e práticas.
              </h1>
              <p className='max-w-xl text-gray-300 sm:mx-auto'>
                Os nossos cursos são uma ferramenta online que permite a todos os interessados em construir uma diferente forma de vida num mundo equitativo e sustentável.
              </p>
            </div>
          </div>
        </section>
      </GradientWrapper>
      <SectionWrapper className='mt-12 dark:mt-0'>
        <div id='lessons' className='mx-auto max-w-screen-lg px-4 md:px-8'>
          <h2 className='text-xl font-semibold text-gray-800 dark:text-gray-50'>
            Todos os cursos
          </h2>
          <ul className='mt-8 space-y-12 dark:divide-gray-800 sm:space-y-0 sm:divide-y'>
            {cursos.map((item, idx) => (
              <li key={idx} className='sm:py-8'>
                <LessonCardList idx={idx} item={item} />
              </li>
            ))}
          </ul>
        </div>
      </SectionWrapper>
    </>
  )
}
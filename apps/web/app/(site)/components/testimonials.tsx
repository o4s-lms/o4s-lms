import SectionWrapper from "@/components/section-wrapper"
import { createClient } from "@o4s/generated-wundergraph/client"

const client = createClient({
  customFetch: fetch,
})

const Testimonials = async () => {
	const { data, error } = await client.query({
		operationName: 'site/get-testimonials',
		input: {
			locale: 'pt'
		}
	})
	
	const testimonials = data?.testimonials

  return (
    <SectionWrapper
      id="testimonials"
      className="bg-gray-50 dark:my-0 dark:bg-gray-900 sm:my-16"
    >
      <div className="custom-screen text-gray-600 dark:text-gray-300">
        <div className="max-w-xl space-y-3">
          <h3 className="text-3xl font-semibold text-gray-800 dark:text-gray-50 sm:text-4xl">
            <strong>O que dizem os nossos estudantes</strong>
          </h3>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc et est
            hendrerit, porta nunc vitae, gravida justo. Nunc fermentum magna
            lorem, euismod volutpat arcu volutpat et.
          </p>
        </div>
        <div className="mt-12">
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials?.map((item, idx) => (
              <li
                key={idx}
                className="rounded-xl bg-gray-200 p-4 dark:bg-gray-800"
              >
                <figure>
                  <div className="flex items-center gap-x-4">
                    <img src={item.avatar} className="h-16 w-16 rounded-full" />
                    <div>
                      <span className="block font-semibold text-gray-800 dark:text-gray-100">
                        {item.name}
                      </span>
                      <span className="mt-0.5 block text-sm text-gray-600  dark:text-gray-300">
                        {item.title}
                      </span>
                    </div>
                  </div>
                  <blockquote>
                    <p className="mt-6 text-gray-700 dark:text-gray-400">
                      {item.quote}
                    </p>
                  </blockquote>
                </figure>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </SectionWrapper>
  )
}

export default Testimonials
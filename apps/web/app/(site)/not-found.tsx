import Link from "next/link"

const PageNotFound = () => {
	return (
		<section className="flex h-full items-center p-16 dark:bg-gray-900 dark:text-gray-100">
			<div className="container mx-auto my-8 flex flex-col items-center justify-center px-5">
				<div className="max-w-md text-center">
					<h2 className="mb-8 text-9xl font-extrabold dark:text-gray-600">
						<span className="sr-only">Erro</span>404
					</h2>
					<p className="text-2xl font-semibold md:text-3xl">Desculpe, não foi possível encontrar esta página.</p>
					<p className="mb-8 mt-4 dark:text-gray-400">Mas não se preocupe, você pode encontrar as coisas a partir da nossa página inicial.</p>
					<Link rel="noopener noreferrer" href="/" className="rounded px-8 py-3 font-semibold dark:bg-violet-400 dark:text-gray-900">Voltar à página principal</Link>
				</div>
			</div>
		</section>
	)
}

export default PageNotFound;
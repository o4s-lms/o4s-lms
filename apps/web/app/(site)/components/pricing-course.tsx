export const PrincingCourse = () => {

	const plan = {
			name: "Basic plan",
			desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
			price: 35,
			isMostPop: true,
			features: [
					"Curabitur faucibus",
					"Curabitur faucibus",
					"Curabitur faucibus",
					"Curabitur faucibus",
					"Curabitur faucibus",
					"Curabitur faucibus",
					"Curabitur faucibus",
					"Curabitur faucibus",
			],
	}

	const features = [
			{
					name: "Público-alvo",
					desc: "Todas as pessoas interessadas num mundo mais justo e sustentável.",
					icon:
							<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
									<path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
							</svg>
			},
			{
					name: "Objetivos",
					desc: "Orientar os participantes num caminho de transformação para a sustentabilidade.",
					icon:
							<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
									<path strokeLinecap="round" strokeLinejoin="round" d="M6.429 9.75L2.25 12l4.179 2.25m0-4.5l5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L21.75 12l-4.179 2.25m0 0l4.179 2.25L12 21.75 2.25 16.5l4.179-2.25m11.142 0l-5.571 3-5.571-3" />
							</svg>
			},
			{
					name: "Conhecimento e Compreensão",
					desc: "O estudante será capaz de discutir os princípios e a ética da Permacultura e identificar as prioridades para aumentar o seu nível de sustentabilidade. Terá conhecimentos acerca de solos e fertilidade, água para a casa e para a paisagem, e sistemas de cultivo para o contexto rural e o contexto urbano.",
					icon:
							<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
									<path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
							</svg>
			},
			{
					name: "Habilidades",
					desc: "O estudante será capaz de aplicar habilidades estratégicas e práticas para um modo de vida mais sustentável e de pôr em prática ações de permacultura em qualquer contexto.",
					icon:
							<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
									<path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
							</svg>
			},
	]

	return (
		<section className='relative py-14'>
			<div className="mx-auto max-w-screen-xl text-gray-600 md:px-8">
				<div className='relative max-w-xl space-y-3 px-4 md:px-0'>
					<h3 className="font-semibold text-indigo-600">
						Preço
					</h3>
					<p className='text-3xl font-semibold text-gray-800 sm:text-4xl'>
						Pay as you grow
					</p>
					<div className='max-w-xl'>
						<p>
							Este percurso de aprendizagem para a sustentabilidade não requer conhecimentos prévios dos temas. Para mais informações sobre a metodologia dos cursos e o funcionamento da plataforma de aprendizagem consulta as Perguntas Frequentes (FAQs)
						</p>
					</div>
				</div>
				<div className='mt-16 justify-between gap-8 md:flex'>
					<ul className="max-w-md flex-1 space-y-10 px-4 md:px-0">
						{
							features.map((item, idx) => (
								<li key={idx} className="flex gap-x-3">
									<div className="flex h-12 w-12 flex-none items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
										{item.icon}
									</div>
									<div>
										<h4 className="text-lg font-medium text-gray-800">
											{item.name}
										</h4>
										<p className="mt-2 text-gray-600 md:text-sm">
											{item.desc}
										</p>
									</div>
								</li>
							))
						}
					</ul>
					<div className="md:border-x-none mt-6 flex flex-1 flex-col border-y md:mt-0 md:max-w-xl md:rounded-xl md:border md:shadow-lg">
						<div className="border-b p-4 py-8 md:p-8">
							<div className="flex justify-between">
								<div className="max-w-xs">
									<span className='text-2xl font-semibold text-gray-800 sm:text-3xl'>
										{plan.name}
									</span>
									<p className="mt-3 sm:text-sm">
										{plan.desc}
									</p>
								</div>
								<div className='flex-none text-2xl font-semibold text-gray-800 sm:text-3xl'>
									${plan.price} <span className="text-xl font-normal text-gray-600">/mo</span>
								</div>
							</div>
							<button className='mt-4 w-full rounded-lg bg-indigo-600 p-3 text-sm font-semibold text-white duration-150 hover:bg-indigo-500 active:bg-indigo-700'>
								Começa Agora
							</button>
						</div>
						<ul className='space-y-3 p-4 sm:grid sm:grid-cols-2 md:block md:p-8 lg:grid'>
							<div className="col-span-2 pb-2 font-medium text-gray-800">
								<p>Módulos de Aprendizagem</p>
							</div>
							{
								plan.features.map((featureItem, idx) => (
									<li key={idx} className='flex items-center gap-5'>
										<svg
											xmlns='http://www.w3.org/2000/svg'
											className='h-5 w-5 text-indigo-600'
											viewBox='0 0 20 20'
											fill='currentColor'>
											<path
												fill-rule='evenodd'
												d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
												clip-rule='evenodd'></path>
										</svg>
										{featureItem}
									</li>
								))
							}
						</ul>
					</div>
				</div>
			</div>
		</section>
	)
}

const plans = [
	{
		name: "Enterprise",
		desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
		price: 32,
		isMostPop: true,
		features: [
			"Curabitur faucibus",
			"massa ut pretium maximus",
			"Sed posuere nisi",
			"Pellentesque eu nibh et neque",
			"Suspendisse a leo",
			"Praesent quis venenatis ipsum",
			"Duis non diam vel tortor",
		],
	},
	{
		name: "Startup",
		desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
		price: 12,
		isMostPop: false,
		features: [
			"Curabitur faucibus",
			"massa ut pretium maximus",
			"Sed posuere nisi",
			"Pellentesque eu nibh et neque",
			"Suspendisse a leo",
			"Praesent quis venenatis ipsum",
			"Duis non diam vel tortor",
		],
	},
]

export const PricingSection = () => {
	return (
		<div className="relative mx-auto max-w-screen-xl text-gray-300 sm:px-4 md:px-8">
			<div className='mt-16 justify-center sm:flex'>
				{
					plans.map((item, idx) => (
						<div key={idx} className={`relative mt-6 flex flex-1 flex-col items-stretch border-2 sm:mt-0 sm:max-w-md sm:rounded-xl ${item.isMostPop ? "border-x-0 border-cyan-400 bg-gray-900 sm:border-x-2" : "border-transparent"}`}>
							<div className="space-y-4 border-b border-gray-700 p-4 py-8 md:p-8">
								<span className='font-medium text-gray-200'>
									{item.name}
								</span>
								<div className='text-3xl font-semibold text-cyan-400'>
									${item.price} <span className="text-xl font-normal">/mo</span>
								</div>
								<p className="text-gray-400">
									{item.desc}
								</p>
								<button className='w-full rounded-lg bg-cyan-500 p-3 text-sm font-semibold text-white duration-150 hover:bg-cyan-600 active:bg-cyan-700'>
									Get Started
								</button>
							</div>
							<ul className='space-y-3 p-4 py-8 md:p-8'>
								{
									item.features.map((featureItem, idx) => (
										<li key={idx} className='flex items-center gap-5'>
											<svg
												xmlns='http://www.w3.org/2000/svg'
												className={`h-5 w-5 ${item.isMostPop ? "text-cyan-600" : ""}`}
												viewBox='0 0 20 20'
												fill='currentColor'>
												<path
													fillRule='evenodd'
													d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
													clipRule='evenodd'>
												</path>
											</svg>
											{featureItem}
										</li>
										))
									}
							</ul>
						</div>
					))
				}
			</div>
		</div>
	)
}
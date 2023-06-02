interface GradientWrapperProps {
	children: React.ReactNode;
  className?: string;
}

const GradientWrapper = ({ children, className }: GradientWrapperProps ) => (
	<div
			className={`relative bg-gray-900 py-28 sm:py-32 ${className || ""}`}>
			<div className="absolute inset-0 m-auto h-[230px] max-w-7xl blur-[138px]"
					style={{
							background:
									"linear-gradient(106.89deg, rgba(2,0,36,1) 0%, rgba(6,108,43,1) 100%, rgba(0,212,255,1) 100%)",
					}}>

			</div>
			<div className="relative">
					{children}
			</div>
	</div>
)

export default GradientWrapper
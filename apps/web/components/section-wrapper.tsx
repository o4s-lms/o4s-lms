interface SectionWrapperProps {
	children: React.ReactNode;
	className?: string;
}

const SectionWrapper: React.FC<SectionWrapperProps> = ({ children, ...props }) => (
    <section className={`py-16 dark:bg-gray-900 sm:py-28 ${props?.className || ""}`}>
        {children}
    </section>
)

export default SectionWrapper
interface SectionWrapperProps {
	children: React.ReactNode;
  className: string;
}

const SectionWrapper = ({ children, className }: SectionWrapperProps) => (
    <section className={`py-2 ${className || ""}`}>
        {children}
    </section>
)

export default SectionWrapper
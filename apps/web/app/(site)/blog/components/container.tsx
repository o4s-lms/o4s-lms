import { cx } from "@/lib/utils";

interface ContainerProps {
	large?: boolean;
	alt?: boolean;
	className?: string;
	children?: React.ReactNode;
}

export default function Container({ children, ...props }: ContainerProps) {
  return (
    <div
      className={cx(
        "container px-8 mx-auto xl:px-5",
        props.large ? " max-w-screen-xl" : " max-w-screen-lg",
        !props.alt && "py-5 lg:py-8",
        props.className
      )}>
      {children}
    </div>
  )
}
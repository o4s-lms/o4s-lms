import React from "react"

interface SubTitleProps {
	children: React.ReactNode
	className?: string
}
export const SubTitle: React.FC<SubTitleProps> = ({ children, className }) => <span className={`${className || ""} font-semibold text-blue-600 dark:text-sky-500`}>{children}</span>
import React from "react"

interface IncludesTitleProps {
	children: React.ReactNode
	className?: string
}

export const Includes: React.FC<IncludesTitleProps> = ({ children, className, ...props }) => <span {...props} className={`text-sm text-gray-700 dark:text-gray-400 font-semibold ${className || ""}`}>{children}</span>
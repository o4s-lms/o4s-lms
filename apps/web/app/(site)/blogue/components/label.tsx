import { cx } from "@/lib/utils"

interface LabelProps {
	archive?: boolean
	pill?: boolean
	nomargin?: boolean
	color?: string
	children?: React.ReactNode
}

export default function Label({ children, ...props }: LabelProps) {
  const color = {
    green: "text-emerald-700",
		red: "text-red-700",
    blue: "text-blue-600",
    orange: "text-orange-700",
    purple: "text-purple-600",
    pink: "text-pink-600"
  };
  const bgcolor = {
    green: "bg-emerald-50",
		red: "bg-red-50",
    blue: "bg-blue-50",
    orange: "bg-orange-50",
    purple: "bg-purple-50",
    pink: "bg-pink-50"
  };
  const margin = props.nomargin;

  if (props.pill) {
    return (
      <div
        className={
          "inline-flex h-6 shrink-0 items-center justify-center rounded-full bg-blue-50 px-2 text-sm font-bold text-blue-500 dark:bg-gray-800 dark:text-gray-300"
        }>
        {children}
      </div>
    );
  }

	if (props.archive) {
		return (
			<h1
      className={cx(
        "text-3xl font-semibold tracking-tight lg:text-4xl lg:leading-snug inline-block uppercase ",
        !margin && " mt-5",
        color[props.color] || color[pink]
      )}>
      {children}
    </h1>
		)
	}

  return (
    <span
      className={cx(
        "inline-block text-xs font-medium tracking-wider uppercase ",
        !margin && " mt-5",
        color[props.color] || color[pink]
      )}>
      {children}
    </span>
  );
}
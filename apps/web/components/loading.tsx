import { Skeleton } from "@/components/ui/skeleton"
 
export function Loading() {
  return (
    <div className="flex items-center space-x-4">
      <Skeleton className="h-24 w-24 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[300px]" />
				<Skeleton className="h-4 w-[350px]" />
      </div>
    </div>
  )
}
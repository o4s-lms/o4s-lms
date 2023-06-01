import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { CoursesAllResponseData } from "@o4s/generated-wundergraph/models"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { minioImage } from "@/lib/minio"
import Link from "next/link"

type Course = CoursesAllResponseData["courses"][number]
interface CourseCardProps {
	item: Course;
}

export function CourseCard({ item }: CourseCardProps) {
  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>{item.name}</CardTitle>
        <CardDescription>{item.description}</CardDescription>
      </CardHeader>
      <CardContent>
				<Avatar className="h-60 w-60 rounded-full">
          <AvatarImage src={minioImage(item.image)} alt={item.name} />
        </Avatar>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="ghost">Cancel</Button>
				<Link href={`/courses/${item.id}`} >
        	<Button>Deploy</Button>
				</Link>
      </CardFooter>
    </Card>
  )
}

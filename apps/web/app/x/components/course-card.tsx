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
import { CoursesAuthorResponseData, UsersMy_coursesResponseData } from "@o4s/generated-wundergraph/models"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { minioImage } from "@/lib/minio"

type Course = CoursesAuthorResponseData["courses"][number]
interface Props {
	course: Course;
}

export function CourseCard({ course }: Props) {
  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>{course.name}</CardTitle>
        <CardDescription>{course.description}</CardDescription>
      </CardHeader>
      <CardContent>
				<Avatar className="h-60 w-60 rounded-full">
          <AvatarImage src={minioImage(course.image)} alt={course.name} />
        </Avatar>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="ghost">Cancel</Button>
        <Button>Deploy</Button>
      </CardFooter>
    </Card>
  )
}

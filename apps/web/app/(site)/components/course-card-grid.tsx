import Link from "next/link"
import { Includes } from "./includes"
import { Title } from "./title"
import { SubTitle } from "./sub-title"
import { SiteGet_coursesResponseData } from "@o4s/generated-wundergraph/models"
import React from "react"

type Course = SiteGet_coursesResponseData["courses"][number]
interface CourseCardGrid {
	idx: number
	item: Course
}

export const CourseCardGrid: React.FC<CourseCardGrid> = ({ idx, item: { thumbnail, price, title, description, include, slug } }) => {

    return (
        <div className="space-y-2 sm:max-w-sm">
            <Link href={`/cursos/sustentabilidade/${slug}`}>
                <img src={thumbnail} className="w-full rounded-lg" alt={title} />
            </Link>
            <div className="flex items-center justify-between pt-2 text-sm">
                <SubTitle>Preço: {price}</SubTitle>
                <Includes>{include}</Includes>
            </div>
            <Title>
                <Link href={`/cursos/sustentabilidade/${slug}`}>
                    {title}
                </Link>
            </Title>
            <p>
                {description}
            </p>
        </div>
    )
}
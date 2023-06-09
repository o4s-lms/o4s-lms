import Link from "next/link"
import Image from "next/image"
import { Includes } from "./includes"
import { Title } from "./title"
import { SubTitle } from "./sub-title"
import { ProductsAllResponseData } from "@o4s/generated-wundergraph/models"
import React from "react"
import { capitalize } from "@/lib/utils"
import Price from "./price"

type Product = ProductsAllResponseData["products"][number]
interface ProductCardGrid {
	idx: number
	item: Product
}

export const ProductCardGrid: React.FC<ProductCardGrid> = ({ idx, item: { thumbnail, price, currency, title, description, include, slug } }) => {

    return (
        <div className="space-y-2 sm:max-w-sm">
            <Link href={`/cursos/${slug}`}>
                <img src={thumbnail} className="w-full rounded-lg" alt={title} />
            </Link>
            <div className="flex items-center justify-between pt-2 text-sm">
								<SubTitle>
									<Price
										currency={currency}
										num={price}
										numSize="text-lg"
									/>
								</SubTitle>
                <Includes>{include}</Includes>
            </div>
            <Title>
                <Link href={`/cursos/${slug}`}>
                    {title}
                </Link>
            </Title>
            <p>
                {description}
            </p>
        </div>
    )
}
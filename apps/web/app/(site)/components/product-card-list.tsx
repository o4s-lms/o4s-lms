import Link from "next/link"
import { Includes } from "./includes"
import { Title } from "./title"
import { SubTitle } from "./sub-title"
import { ProductsAllResponseData } from "@o4s/generated-wundergraph/models"
import { capitalize } from "@/lib/utils"
import { createClient } from "@o4s/generated-wundergraph/client"

const client = createClient()

type Product = ProductsAllResponseData["products"][number]
interface ProductCardList {
	idx: number
	item: Product
}

export const ProductCardList: React.FC<ProductCardList> = ({ idx, item: { thumbnail, price, currency, title, description, include, slug } }) => {

    return (
        <div className="gap-x-6 sm:flex">
            <Link
                href={`/cursos/${slug}`}
                className="sm:max-w-[17rem]"
            >
                <img
                    src={thumbnail}
                    className="w-full rounded-lg"
                    alt={title}
                    loading="lazy"
                />
            </Link>
            <div className="space-y-2 pt-4 sm:pt-0">
                <div className="flex items-center justify-between text-sm">
                    <SubTitle>Preço: {String(price/100)} {capitalize(currency)}</SubTitle>
                    <Includes className="sm:hidden">
                        {include}
                    </Includes>
                </div>
                <Title>
                    <Link
                        href={`/cursos/${slug}`}
                    >
                        {title}
                    </Link>
                </Title>
                <p className="max-w-xl text-gray-600 dark:text-gray-300 sm:line-clamp-2">
                    {description}
                </p>
                <Includes className="hidden sm:block">
                    {include}
                </Includes>
            </div>
        </div>
    )
}
"use client"

import Link from "next/link"
import { useState } from "react"
import { PlayListButton } from "./play-list-button"
import { ProductsAllResponseData } from "@o4s/generated-wundergraph/models"

type Products = ProductsAllResponseData["products"]

interface PlayListProps {
	items: Products | undefined;
	className: string;
	slug: string;
	props?: string[];
}

export const PlayList = ({ items, className, slug, ...props }: PlayListProps) => {

    const [isOpen, setOpen] = useState(false)

    return (
        <div {...props} className={`${className || ""} border-y dark:border-gray-800 lg:border-none`}>
            <PlayListButton
                isOpen={isOpen}
                onClick={() => setOpen(!isOpen)}
            />
            <h3 className="hidden text-xl font-semibold text-gray-800 dark:text-gray-50 lg:block">
                Módulos de aprendizagem
            </h3>
            <div className={isOpen ? "" : "hidden lg:block"}>
                <p className="mt-4 text-gray-700 dark:text-gray-400 lg:mt-3">
                    3 Módulos
                </p>
                <ul className="mt-6 max-h-[450px] space-y-1 overflow-auto pb-4 lg:max-w-sm lg:pb-0">
                    {
                        items?.map((item, idx) => (
                            <li key={idx} className={`rounded-lg text-gray-600 duration-150 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800 ${slug == item.slug ? "bg-gray-50 dark:bg-gray-800" : ""}`}>
                                <Link
                                    href={`/cursos/${item.slug}`}
                                    className="flex items-center gap-x-3 p-3"
                                >
                                    <span className="text-sm font-medium">{idx + 1}</span>
                                    <h4 className="flex-1 font-medium text-gray-700 dark:text-gray-200 lg:line-clamp-1">
                                        {item.title}
                                    </h4>
                                    
                                </Link>
                            </li>
                        ))
                    }
                </ul>
            </div>
        </div>
    )
}
'use client'

import Link from 'next/link'

type Props = {
    id: string
    title: string
    image: string
}

export default function RecipeCard({ id, title, image }: Props) {
    return (
        <Link href={`/recipe/${id}`}>
            <div className="border rounded-lg overflow-hidden shadow hover:shadow-md transition">
                <img src={image} alt={title} className="w-full h-40 object-cover" />
                <div className="p-4 font-medium">{title}</div>
            </div>
        </Link>
    )
}

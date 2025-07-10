import axios from 'axios'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Suspense } from 'react'

type Props = {
    params: { id: string }
}

function getIngredients(recipe: any) {
    const ingredients: { ingredient: string; measure: string }[] = []

    for (let i = 1; i <= 20; i++) {
        const ingredient = recipe[`strIngredient${i}`]
        const measure = recipe[`strMeasure${i}`]
        if (ingredient && ingredient.trim()) {
            ingredients.push({ ingredient, measure })
        }
    }

    return ingredients
}

async function RecipeDetailContent({ id }: { id: string }) {
    const res = await axios.get(
        `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
    )

    const recipe = res.data.meals?.[0]

    if (!recipe) {
        return (
            <div className="p-4 max-w-3xl mx-auto text-center">
                <h1 className="text-xl font-semibold">Recipe not found</h1>
                <Link href="/">
                    <Button variant="outline" className="mt-4">Back to Home</Button>
                </Link>
            </div>
        )
    }

    const ingredients = getIngredients(recipe)

    return (
        <div className="p-6 max-w-5xl mx-auto space-y-6">
            <Link href="/">
                <Button variant="outline">← Back to Recipes</Button>
            </Link>

            <h1 className="text-4xl font-bold text-center">{recipe.strMeal}</h1>

            <div className="grid md:grid-cols-2 gap-6 items-start">
                <img
                    src={recipe.strMealThumb}
                    alt={recipe.strMeal}
                    className="w-full rounded-lg shadow-md"
                />

                <div className="space-y-4 text-base leading-relaxed">
                    <p><span className="font-semibold">Category:</span> {recipe.strCategory}</p>
                    <p><span className="font-semibold">Area:</span> {recipe.strArea}</p>

                    <div>
                        <h2 className="text-xl font-semibold mt-4 mb-2">Ingredients:</h2>
                        <ul className="list-disc pl-5 space-y-1">
                            {ingredients.map(({ ingredient, measure }, i) => (
                                <li key={i}>
                                    {measure} {ingredient}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold mt-4 mb-2">Instructions:</h2>
                        <p className="whitespace-pre-line">{recipe.strInstructions}</p>
                    </div>

                    {recipe.strSource && (
                        <a
                            href={recipe.strSource}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block text-blue-600 hover:underline mt-4"
                        >
                            📎 View Full Recipe on TheMealDB
                        </a>
                    )}
                </div>
            </div>
        </div>
    )
}

export default function RecipeDetail({ params }: Props) {
    return (
        <Suspense fallback={<RecipeDetailSkeleton />}>
            <RecipeDetailContent id={params.id} />
        </Suspense>
    )
}

function RecipeDetailSkeleton() {
    return (
        <div className="p-6 max-w-5xl mx-auto space-y-6 animate-pulse">
            <Skeleton className="w-48 h-8 mb-4" />
            <Skeleton className="w-full h-64 rounded-lg" />
            <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-5 w-2/3" />
                    <Skeleton className="h-5 w-1/2" />
                </div>
                <div className="space-y-3">
                    <Skeleton className="h-5 w-1/2" />
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-5 w-full" />
                </div>
            </div>
        </div>
    )
}

'use client'

import { useEffect, useState } from 'react'
import { useAppSelector, useAppDispatch } from '@/store/hooks'
import { fetchRandomRecipes, setRecipes } from '@/store/slices/recipeSlice'
import SearchBar from '@/components/SearchBar'
import RecipeCard from '@/components/RecipeCard'
import FilterBar from '@/components/FilterBar'
import AlphaFilterDropdown from '@/components/AlphaFilter'
import { FilterProvider, useFilterReset } from '@/context/FilterContext'
import { Button } from '@/components/ui/button'

function HomeContent() {
    const dispatch = useAppDispatch()
    const { items, loading } = useAppSelector((state) => state.recipes)
    const [page, setPage] = useState(1)
    const { triggerReset } = useFilterReset()

    useEffect(() => {
        if (items.length === 0) {
            dispatch(fetchRandomRecipes(15))
        }
    }, [page, dispatch, items.length])

    const handleNext = () => setPage((p) => p + 1)
    const handlePrev = () => setPage((p) => (p > 1 ? p - 1 : 1))

    const handleResetAll = () => {
        dispatch(setRecipes([]))
        setPage(1)
        triggerReset()
    }

    return (
        <main className="p-4 max-w-5xl mx-auto space-y-6">
            <h1 className="text-3xl font-bold text-center">🍽️ Recipe Finder</h1>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <SearchBar />
                <Button variant="outline" onClick={handleResetAll}>
                    🔄 Reset All Filters
                </Button>
            </div>

            <FilterBar />
            <AlphaFilterDropdown />

            {loading ? (
                <p className="text-center">Loading...</p>
            ) : (
                <>
                    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {items.map((meal: any) => (
                            <RecipeCard
                                key={meal.idMeal}
                                id={meal.idMeal}
                                title={meal.strMeal}
                                image={meal.strMealThumb}
                            />
                        ))}
                    </div>

                    <div className="flex justify-center gap-4 pt-4">
                        <Button onClick={handlePrev} disabled={page === 1}>
                            Prev
                        </Button>
                        <span className="text-center py-2 px-4">Page {page}</span>
                        <Button onClick={handleNext}>Next</Button>
                    </div>
                </>
            )}
        </main>
    )
}

export default function HomePage() {
    return (
        <FilterProvider>
            <HomeContent />
        </FilterProvider>
    )
}

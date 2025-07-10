'use client'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'
import { useAppDispatch } from '@/store/hooks'
import { fetchRandomRecipes } from '@/store/slices/recipeSlice'
import axios from 'axios'
import Link from 'next/link'
import {useFilterReset} from "@/context/FilterContext";

type Meal = {
    idMeal: string;
    strMeal: string;
    strMealThumb: string;
}

export default function SearchBar() {
    const [query, setQuery] = useState('')
    const [suggestions, setSuggestions] = useState<Meal[]>([])
    const [debouncedQuery, setDebouncedQuery] = useState('')
    const dispatch = useAppDispatch()
    const {reset} = useFilterReset()

    useEffect(() => {
        const timeout = setTimeout(() => {
            setDebouncedQuery(query)
        }, 300)
        return () => clearTimeout(timeout)
    }, [query]);

    useEffect(() => {
        const fetchSuggestions = async () => {
            if (!debouncedQuery) {
                setSuggestions([])
                return
            }

            try {
                const res = await axios.get(
                    `https://www.themealdb.com/api/json/v1/1/search.php?s=${debouncedQuery}`
                )
                setSuggestions(res.data.meals || [])
            } catch (err) {
                setSuggestions([])
            }
        }

        fetchSuggestions()
    }, [debouncedQuery])

    const handleSearch = () => {
        if (query.trim()) {
            dispatch(fetchRandomRecipes(query))
            setSuggestions([])
        }
    }

    useEffect(() => {
        if (reset) setQuery('')
    }, [reset])

    return (
        <div className={"relative w-full max-w-xl mx-auto"}>
        <div className="flex items-center space-x-2">
            <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search for recipes..." />
            <Button onClick={handleSearch}>Search</Button>
        </div>

            {suggestions.length > 0 && (
                <ul className={"absolute z-10 w-full mt-2 bg-white border border-b-gray-200 rounded shadow max-h-64 overflow-y-auto"}>
                    {suggestions.map((meal) => (
                        <li key={meal.idMeal}>
                            <Link
                                href={`/recipe/${meal.idMeal}`}
                                className="block px-4 py-2 hover:bg-gray-100"
                                onClick={() => setSuggestions([])} // hide after click
                            >
                                🍽️ {meal.strMeal}
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}

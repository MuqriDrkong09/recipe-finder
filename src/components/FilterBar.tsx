'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import { useAppDispatch } from '@/store/hooks'
import { setRecipes } from '@/store/slices/recipeSlice'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'

export default function FilterBar() {
    const dispatch = useAppDispatch()
    const [categories, setCategories] = useState<string[]>([])
    const [areas, setAreas] = useState<string[]>([])
    const [ingredients, setIngredients] = useState<string[]>([])

    const [selectedCategory, setSelectedCategory] = useState<string | undefined>()
    const [selectedArea, setSelectedArea] = useState<string | undefined>()
    const [selectedIngredient, setSelectedIngredient] = useState<string | undefined>()

    useEffect(() => {
        const fetchFilters = async () => {
            const [catRes, areaRes, ingRes] = await Promise.all([
                axios.get('https://www.themealdb.com/api/json/v1/1/list.php?c=list'),
                axios.get('https://www.themealdb.com/api/json/v1/1/list.php?a=list'),
                axios.get('https://www.themealdb.com/api/json/v1/1/list.php?i=list'),
            ])
            setCategories(catRes.data.meals.map((item: any) => item.strCategory))
            setAreas(areaRes.data.meals.map((item: any) => item.strArea))
            setIngredients(ingRes.data.meals.map((item: any) => item.strIngredient))
        }

        fetchFilters()
    }, [])

    const handleFilter = async (type: string, value: string) => {
        const res = await axios.get(
            `https://www.themealdb.com/api/json/v1/1/filter.php?${type}=${value}`
        )
        dispatch(setRecipes(res.data.meals || []))
    }

    const handleReset = () => {
        setSelectedCategory(undefined)
        setSelectedArea(undefined)
        setSelectedIngredient(undefined)
        dispatch(setRecipes([])) // clears Redux recipes
    }

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Category */}
                <Select
                    value={selectedCategory}
                    onValueChange={(val) => {
                        setSelectedCategory(val)
                        handleFilter('c', val)
                    }}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Filter by Category" />
                    </SelectTrigger>
                    <SelectContent>
                        {categories.map((c) => (
                            <SelectItem key={c} value={c}>
                                {c}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {/* Area */}
                <Select
                    value={selectedArea}
                    onValueChange={(val) => {
                        setSelectedArea(val)
                        handleFilter('a', val)
                    }}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Filter by Area" />
                    </SelectTrigger>
                    <SelectContent>
                        {areas.map((a) => (
                            <SelectItem key={a} value={a}>
                                {a}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {/* Ingredient */}
                <Select
                    value={selectedIngredient}
                    onValueChange={(val) => {
                        setSelectedIngredient(val)
                        handleFilter('i', val)
                    }}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Filter by Ingredient" />
                    </SelectTrigger>
                    <SelectContent>
                        {ingredients.map((i) => (
                            <SelectItem key={i} value={i}>
                                {i}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
    )
}

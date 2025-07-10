'use client'

import { useState, useEffect } from 'react'
import { useAppDispatch } from '@/store/hooks'
import { setRecipes } from '@/store/slices/recipeSlice'
import axios from 'axios'
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from '@/components/ui/select'
import {useFilterReset} from "@/context/FilterContext";

const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

export default function AlphaFilterDropdown() {
    const dispatch = useAppDispatch()
    const [selectedLetter, setSelectedLetter] = useState<string | undefined>()
    const { reset } = useFilterReset()

    const handleSelect = async (letter: string) => {
        setSelectedLetter(letter)
        const res = await axios.get(`https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`)
        dispatch(setRecipes(res.data.meals || []))
    }

    useEffect(() => {
        if (reset) setSelectedLetter(undefined)
    }, [reset])

    return (
        <div className="w-full md:w-1/3">
            <Select onValueChange={handleSelect} value={selectedLetter}>
                <SelectTrigger>
                    <SelectValue placeholder="Filter by First Letter" />
                </SelectTrigger>
                <SelectContent>
                    {letters.map((letter) => (
                        <SelectItem key={letter} value={letter}>
                            {letter}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    )
}

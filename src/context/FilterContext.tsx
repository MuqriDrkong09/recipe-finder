'use client'

import { createContext, useContext, useState } from 'react'

type FilterContextType = {
    reset: boolean
    triggerReset: () => void
}

const FilterContext = createContext<FilterContextType | null>(null)

export const FilterProvider = ({ children }: { children: React.ReactNode }) => {
    const [reset, setReset] = useState(false)

    const triggerReset = () => {
        setReset(true)
        setTimeout(() => setReset(false), 100) // short-lived reset flag
    }

    return (
        <FilterContext.Provider value={{ reset, triggerReset }}>
            {children}
        </FilterContext.Provider>
    )
}

export const useFilterReset = () => {
    const ctx = useContext(FilterContext)
    if (!ctx) throw new Error('useFilterReset must be used within FilterProvider')
    return ctx
}

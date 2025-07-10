// store/slices/recipeSlice.ts
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'

export const fetchRandomRecipes = createAsyncThunk(
    'recipes/fetchRandomRecipes',
    async (count: number = 9) => {
        const requests = Array.from({ length: count }, () =>
            axios.get('https://www.themealdb.com/api/json/v1/1/random.php')
        )
        const responses = await Promise.all(requests)
        const meals = responses.map((res) => res.data.meals[0])
        return meals
    }
)

const recipeSlice = createSlice({
    name: 'recipes',
    initialState: {
        items: [] as any[],
        loading: false,
    },
    reducers: {
        // ✅ Your custom reducer for setting recipe list from filters/search/etc.
        setRecipes(state, action: PayloadAction<any[]>) {
            state.items = action.payload
            state.loading = false
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchRandomRecipes.pending, (state) => {
                state.loading = true
            })
            .addCase(fetchRandomRecipes.fulfilled, (state, action) => {
                state.items = action.payload
                state.loading = false
            })
            .addCase(fetchRandomRecipes.rejected, (state) => {
                state.loading = false
            })
    },
})

// Export actions and reducer
export const { setRecipes } = recipeSlice.actions
export default recipeSlice.reducer

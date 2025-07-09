import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

export const fetchRecipes = createAsyncThunk(
    'recipes/fetchRecipes',
    async (query: string) => {
        const res = await axios.get(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`)
        return res.data.meals || []
    }
)

const recipeSlice = createSlice({
    name: 'recipes',
    initialState: { items: [], loading: false },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchRecipes.pending, (state) => { state.loading = true })
            .addCase(fetchRecipes.fulfilled, (state, action) => {
                state.items = action.payload
                state.loading = false
            })
            .addCase(fetchRecipes.rejected, (state) => {
                state.loading = false
            })
    }
})

export default recipeSlice.reducer


import { createSlice,PayloadAction } from "@reduxjs/toolkit"


interface FilterState {
    selectedCategory:string
}
const initialState:FilterState={
    selectedCategory:"all"
}

export const filterSlice= createSlice({
    name:"filters",
    initialState,
    reducers:{
        setSelectedCategory:(state,action:PayloadAction<string>)=>{
            state.selectedCategory = action.payload
        }
    }
})

export const  {setSelectedCategory} = filterSlice.actions
export default filterSlice.reducer

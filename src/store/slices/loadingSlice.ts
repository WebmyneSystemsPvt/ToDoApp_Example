import { createSlice } from '@reduxjs/toolkit'

// ✅ Interface for the loading slice state
interface LoadingState {
    loading: boolean; // Indicates whether a loading spinner or similar should be shown
}

// ✅ Initial state: loading is false by default
const initialState: LoadingState = {
    loading: false,
}

// ✅ Create the loading slice using Redux Toolkit
const loadingSlice = createSlice({
    name: 'loading',     // Slice name
    initialState,        // Initial state
    reducers: {
        // ✅ Action to set the loading state
        setLoading: (state, action) => {
            state.loading = action.payload.loading // Update the loading boolean
        },
    },
})

// ✅ Export action for dispatching
export const { setLoading } = loadingSlice.actions

// ✅ Export reducer to include in the store
export default loadingSlice.reducer

import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './store';

// Custom hook to use the Redux dispatch function with the correct TypeScript type
// Ensures that dispatched actions are type-checked according to AppDispatch
export const useAppDispatch = () => useDispatch<AppDispatch>();

// Custom typed version of useSelector hook
// Allows selecting state from the Redux store with correct type inference
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

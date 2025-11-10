import { combineReducers } from 'redux';
import loadingeducer from './slices/loadingSlice';
import todoReducer from './slices/todoSlice';

// Combine all individual slice reducers into a single root reducer
// This allows the Redux store to manage multiple slices of state
const RootReducer = combineReducers({
    // 'todo' slice will be managed by todoReducer
    todo: todoReducer,

    // 'loader' slice will be managed by loadingeducer
    loader: loadingeducer,
});

export default RootReducer;

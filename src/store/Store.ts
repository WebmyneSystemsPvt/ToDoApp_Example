import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './RootReducer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistReducer, persistStore } from 'redux-persist';

// Configuration for redux-persist
const persistConfig = {
    key: 'root',              // Key for the persisted storage
    storage: AsyncStorage,    // Use AsyncStorage to persist state on device
    whitelist: ['todo'],      // Only persist the 'todo' slice
    // blacklist: ['someTransientReducer'], // Optional: exclude reducers from persistence
};

// Wrap the root reducer with persistReducer to enable persistence
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create the Redux store using the persisted reducer
export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false, // Disable serializable check for redux-persist compatibility
            thunk: true,              // Enable redux-thunk for async actions
        }).concat(),                  // You can add custom middleware here
});

// Create a persistor to control persistence (used in <PersistGate />)
export const persistor = persistStore(store);

// Types for TypeScript
export type AppStore = typeof store;                         // Type for the store
export type RootState = ReturnType<AppStore['getState']>;    // Type for the root state
export type AppDispatch = AppStore['dispatch'];              // Type for dispatch function

export default store;  // Export store as default

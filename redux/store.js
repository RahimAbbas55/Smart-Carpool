import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./slices/rootReducer";  // Fix: Import the default export

export const store = configureStore({
    reducer: {
        root: rootReducer,  // Use the imported reducer
    },
});
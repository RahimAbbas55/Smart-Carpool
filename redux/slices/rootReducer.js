import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    origin: null,
    destination: null,
    travelTimeInformation: null,
};

export const rootSlice = createSlice({
    name: 'root',
    initialState,
    reducers: {  
        setOrigin: (state, action) => {
            state.origin = action.payload;
        },
        setDestination: (state, action) => {
            state.destination = action.payload;
        },
        setTravelTimeInformation: (state, action) => {
            state.travelTimeInformation = action.payload;
        },
    }
});

export const { setOrigin, setDestination, setTravelTimeInformation } = rootSlice.actions;

export const selectOrigin = (state) => state.root.origin;
export const selectDestination = (state) => state.root.destination;
export const selectTravelTimeInformation = (state) => state.root.travelTimeInformation;

export default rootSlice.reducer;  // Default export
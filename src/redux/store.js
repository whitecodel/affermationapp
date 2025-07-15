import { configureStore } from "@reduxjs/toolkit";

import counterReducer from "./reducer/CounterSlice";
import AuthReducer from "./reducer/AuthSlice";
import AffermationReducer from "./reducer/AffermationSlice"


export const store = configureStore({
    reducer: {
        counter: counterReducer,
        auth: AuthReducer,
        affer: AffermationReducer

    },
});

export default store;

import { configureStore } from "@reduxjs/toolkit";
import crudOperation from "../slice/crudslice";

export const store = configureStore({
    reducer:{crudOperation:crudOperation},
    middleware:getDefaultMiddleware=>getDefaultMiddleware({
        serializableCheck:false,
    }),
})
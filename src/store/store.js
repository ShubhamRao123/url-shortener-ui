// src/store/store.js
import { configureStore } from "@reduxjs/toolkit";
import linkReducer from "./linkSlice";

const store = configureStore({
  reducer: {
    links: linkReducer,
  },
});

export default store;

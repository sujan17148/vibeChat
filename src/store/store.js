import { configureStore } from "@reduxjs/toolkit"
import currentUserReducer from "./currentUserSlice"
import extraInfoReducer from "./extraInfoSlice"

const store=configureStore({
  reducer:{
   currentUser:currentUserReducer,
   extraInfo:extraInfoReducer
  },
  devTools: process.env.NODE_ENV !== 'production', 
})

export default store;
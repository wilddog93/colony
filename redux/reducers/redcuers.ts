import { combineReducers } from '@reduxjs/toolkit';
import counterSlice from '../features/counter/counterSlice';
import kanyeReducer from '../features/kanye/kanyeReducer';

export const combinedReducer = combineReducers({
    //All reducer
    counter: counterSlice,
    kanyeQuote: kanyeReducer
});
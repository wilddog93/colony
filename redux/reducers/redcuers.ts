import { combineReducers } from '@reduxjs/toolkit';
import counterSlice from '../features/counter/counterSlice';
import kanyeReducer from '../features/kanye/kanyeReducer';
import { loginReducers, profileReducers } from '../features/auth/authReducers';

export const combinedReducer = combineReducers({
    //All reducer
    counter: counterSlice,
    kanyeQuote: kanyeReducer,
    loginReducers: loginReducers,
    profileReducers: profileReducers,
});
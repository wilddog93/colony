import { combineReducers } from '@reduxjs/toolkit';
import counterSlice from '../features/counter/counterSlice';
import kanyeReducer from '../features/kanye/kanyeReducer';
import { loginGoogleReducers, loginReducers, profileReducers, registerReducers } from '../features/auth/authReducers';

export const combinedReducer = combineReducers({
    //All reducer
    counter: counterSlice,
    kanyeQuote: kanyeReducer,
    loginReducers: loginReducers,
    loginGoogleReducers: loginGoogleReducers,
    registerReducers: registerReducers,
    profileReducers: profileReducers,
});
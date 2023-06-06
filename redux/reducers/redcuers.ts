import { combineReducers } from '@reduxjs/toolkit';
import counterSlice from '../features/counter/counterSlice';
import kanyeReducer from '../features/kanye/kanyeReducer';
import authReducers from '../features/auth/authReducers';
import propertyReducers from '../features/property/propertyReducers';

export const combinedReducer = combineReducers({
    //All reducer
    counter: counterSlice,
    kanyeQuote: kanyeReducer,
    authentication: authReducers,
    propertyAccess: propertyReducers
});
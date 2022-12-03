import { combineReducers } from "redux";
import { authReducers } from "./auth";

const reducer = combineReducers({
    authReducers: authReducers,
});

export default reducer;
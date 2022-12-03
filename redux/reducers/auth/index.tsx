import {
    LOGIN_USER_REQUEST,
    LOGIN_USER_SUCCESS,
    LOGIN_USER_FAIL,
    LOGOUT_USER_FAIL,
    LOGOUT_USER_REQUEST,
    LOGOUT_USER_SUCCESS,
    REGISTER_USER_REQUEST,
    REGISTER_USER_SUCCESS,
    REGISTER_USER_FAIL,
    LOAD_USER_REQUEST,
    LOAD_USER_SUCCESS,
    LOAD_USER_FAIL,
    FORGOT_PASSWORD_REQUEST,
    FORGOT_PASSWORD_SUCCESS,
    FORGOT_PASSWORD_FAIL,
    RESET_PASSWORD_REQUEST,
    RESET_PASSWORD_SUCCESS,
    RESET_PASSWORD_FAIL,
    USER_DETAILS_REQUEST,
    USER_DETAILS_SUCCESS,
    USER_DETAILS_FAIL,
    UPDATE_USER_REQUEST,
    UPDATE_USER_SUCCESS,
    UPDATE_USER_FAIL,
    DELETE_USER_REQUEST,
    DELETE_USER_SUCCESS,
    DELETE_USER_FAIL,
    USER_ROLES_FAIL,
    USER_ROLES_REQUEST,
    USER_ROLES_SUCCESS,

    CLEAR_ERRORS

} from '../../constants/auth/index'

const initialState = {
    user: undefined,
    loading: false,
    isAuthenticated: false,
    accessToken: undefined,
    refreshToken: undefined,
    message: undefined,
    error: undefined,
    access: undefined
}

// Auth reducer
export const authReducers = (initialState: any, action: any) => {
    switch (action.type) {
        // login user
        case LOGIN_USER_REQUEST:
            return {
                loading: true,
                isAuthenticated: false
            };

        case LOGIN_USER_SUCCESS:
            return {
                ...initialState,
                loading: false,
                isAuthenticated: true,
                accessToken: action.payload.accessToken,
                message: action.payload.message
            };

        case LOGIN_USER_FAIL:
            return {
                ...initialState,
                loading: false,
                isAuthenticated: false,
                error: action.payload?.data?.error,
                status: action.payload?.status,
            };

        // logout user
        case LOGOUT_USER_REQUEST:
            return {
                ...initialState,
                loading: true
            };

        case LOGOUT_USER_SUCCESS:
            return {
                ...initialState,
                user: undefined,
                loading: false,
                isAuthenticated: false,
                accessToken: null,
                message: "Sign out's successfully!"
            };

        case LOGOUT_USER_FAIL:
            return {
                ...initialState,
                loading: false,
                error: "Sign out's failed!"
            };

        // register new user
        case REGISTER_USER_REQUEST:
            return {
                ...initialState,
                loading: true
            };

        case REGISTER_USER_SUCCESS:
            return {
                ...initialState,
                loading: false,
                message: action.payload.message,
                user: action.payload.user
            };

        case REGISTER_USER_FAIL:
            return {
                ...initialState,
                loading: false,
                error: action.payload?.data?.error,
            };

        // forgot password
        case FORGOT_PASSWORD_REQUEST:
            return {
                ...initialState,
                loading: true
            };

        case FORGOT_PASSWORD_SUCCESS:
            return {
                ...initialState,
                loading: false,
                message: action.payload,
            };

        case FORGOT_PASSWORD_FAIL:
            return {
                ...initialState,
                loading: false,
                error: action.payload
            };

        // reset password
        case RESET_PASSWORD_REQUEST:
            return {
                ...initialState,
                loading: true
            };

        case RESET_PASSWORD_SUCCESS:
            return {
                ...initialState,
                loading: false,
                success: action.payload.success,
                message: action.payload.message,
            };

        case RESET_PASSWORD_FAIL:
            return {
                ...initialState,
                loading: false,
                error: action.payload
            };

        // load data user
        case LOAD_USER_REQUEST:
            return {
                ...initialState,
                loading: true,
                isAuthenticated: false
            };

        case LOAD_USER_SUCCESS:
            return {
                ...initialState,
                loading: false,
                isAuthenticated: true,
                message: action.payload.message || action.payload.statusText,
                user: action.payload.data,
                refreshToken: action.payload.data.refreshToken
            };

        case LOAD_USER_FAIL:
            return {
                ...initialState,
                user: undefined,
                loading: false,
                isAuthenticated: false,
                error: action.payload
            };

        // user roles
        case USER_ROLES_REQUEST:
            return {
                ...initialState,
                loading: true
            };

        case USER_ROLES_SUCCESS:
            return {
                ...initialState,
                loading: false,
                message: action.payload.message || action.payload.statusText,
                access: action.payload.data
            };

        case USER_ROLES_FAIL:
            return {
                ...initialState,
                loading: false,
                error: action.payload
            };

        // update user
        case UPDATE_USER_REQUEST:
            return {
                ...initialState,
                loading: true
            };

        case UPDATE_USER_SUCCESS:
            return {
                ...initialState,
                loading: false,
                message: action.payload.message
            };

        case UPDATE_USER_FAIL:
            return {
                ...initialState,
                loading: false,
                error: action.payload,
            };

        // delete user
        case DELETE_USER_REQUEST:
            return {
                ...initialState,
                loading: true
            };

        case DELETE_USER_SUCCESS:
            return {
                ...initialState,
                loading: false,
                message: action.payload.message
            };

        case DELETE_USER_FAIL:
            return {
                ...initialState,
                loading: false,
                error: action.payload,
            };

        // user details
        case USER_DETAILS_REQUEST:
            return {
                ...initialState,
                loading: true,
            };

        case USER_DETAILS_SUCCESS:
            return {
                ...initialState,
                loading: false,
                user: action.payload
            };

        case USER_DETAILS_FAIL:
            return {
                loading: false,
                error: action.payload
            };

        // clear error
        case CLEAR_ERRORS:
            return {
                ...initialState,
                error: null
            };

        default:
            return initialState
    }
};

import {
    CLEAR_ERRORS,
    DELETE_USER_FAIL,
    DELETE_USER_REQUEST,
    DELETE_USER_SUCCESS,

    FORGOT_PASSWORD_FAIL,
    FORGOT_PASSWORD_REQUEST,
    FORGOT_PASSWORD_SUCCESS,

    LOAD_USER_FAIL,
    LOAD_USER_REQUEST,
    LOAD_USER_SUCCESS,

    LOGIN_USER_FAIL,
    LOGIN_USER_REQUEST,
    LOGIN_USER_SUCCESS,

    LOGOUT_USER_FAIL,
    LOGOUT_USER_REQUEST,
    LOGOUT_USER_SUCCESS,

    REGISTER_USER_FAIL,
    REGISTER_USER_REQUEST,
    REGISTER_USER_SUCCESS,

    RESET_PASSWORD_FAIL,
    RESET_PASSWORD_REQUEST,
    RESET_PASSWORD_SUCCESS,

    UPDATE_PROFILE_FAIL,
    UPDATE_PROFILE_REQUEST,
    UPDATE_PROFILE_SUCCESS,

    UPDATE_USER_FAIL,
    UPDATE_USER_REQUEST,
    UPDATE_USER_SUCCESS,

    USER_DETAILS_FAIL,
    USER_DETAILS_REQUEST,
    USER_DETAILS_SUCCESS,

    USER_ROLES_FAIL,
    USER_ROLES_REQUEST,
    USER_ROLES_SUCCESS,
} from "../../constants/auth/index";
import { getCookie, removeCookie, setCookie } from "../../../../utils/cookie";

import axios from "axios";
import { toast } from "react-toastify";

// interface Config {
//     "Content-Type": string,
//     Accept: string,
//     Authorization: string;
// }

// login google
export const loginGoogle = (userData: any, route: any) => async (dispatch: any) => {
    try {
        dispatch({ type: LOGIN_USER_REQUEST });

        const res = await axios.post(`auth/web/login/google`, {
            token: userData?.accessToken,
        });
        let { data, status } = res;
        // console.log("resp: ", res)

        if (status == 201) {
            dispatch({
                type: LOGIN_USER_SUCCESS,
                payload: data,
            });
            setCookie("accessToken", data?.accessToken);
            setCookie("refreshToken", data?.refreshToken);
            setCookie("access", data?.access);
            route.push("/auth/selectaccess");
            toast.success("Sign in successfully!");
        } else {
            throw res;
            // toast.error(data?.message)
        }
    } catch (error: any) {
        let { data, status } = error?.response;
        dispatch({
            type: LOGIN_USER_FAIL,
            payload: error?.response,
        });
    }
};

// Login user
export const loginUser = (userData: any, route: any) => async (dispatch: any) => {
    try {
        dispatch({ type: LOGIN_USER_REQUEST });
        const resendData = {
            data: {}
        }
        // "Authorization": `Bearer ${token}`
        let config = {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        };
        const res = await axios.post("/auth/web/login", userData, config);
        let { data, status } = res;
        let token = data?.accessToken;
        let newConfig = {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${token}`
            }
        };
        if (status == 201) {
            dispatch({
                type: LOGIN_USER_SUCCESS,
                payload: data,
            });
            setCookie("accessToken", data?.accessToken);
            setCookie("refreshToken", data?.refreshToken);
            setCookie("access", data?.access);

            if (data.access == "login") {
                route.push("/auth/selectaccess");
                toast.success("Sign in successfully!");
            } else if (data.access == "resendEmail") {
                route.push("/auth/resend-email");
                toast.success("Please verify your email!");
                let resEmail = await axios.patch("/auth/resendEmail", resendData, newConfig);
                if (resEmail?.status == 200) {
                    toast.success(resEmail?.data?.message)
                } else {
                    toast.error(resEmail?.data?.error)
                }
            }

        } else {
            throw data;
            // toast.error(data?.message)
        }
    } catch (error: any) {
        let { data, status } = error?.response;
        dispatch({
            type: LOGIN_USER_FAIL,
            payload: error?.response,
        });
    }
};

// Reauthenticated user
export const reauthenticate = (token: string) => {
    let data = {
        accessToken: token,
    };
    return async (dispatch: any) => {
        await dispatch({ type: LOGIN_USER_SUCCESS, payload: data });
    };
};

// Register user
export const registerUser = (userData: any, id: number, route: any) => async (dispatch: any) => {
    try {
        dispatch({ type: REGISTER_USER_REQUEST });

        const config = {
            headers: {
                "Content-Type": "application/json",
            },
        };

        const res = await axios.post(`auth/register`, userData);
        const { data, status } = res;

        if (status == 201) {
            dispatch({
                type: REGISTER_USER_SUCCESS,
                payload: data,
            });
            // route.push("/auth/login");
            toast.success("Register is successfully!");
        } else {
            throw data;
            toast.error(data?.message);
        }
    } catch (error: any) {
        dispatch({
            type: REGISTER_USER_FAIL,
            payload: error.response?.data,
        });
    }
};

// Register user by invitation
export const registerUserInvitation = (userData: any, id: number, route: any) => async (dispatch: any) => {
    try {
        dispatch({ type: REGISTER_USER_REQUEST });

        const config = {
            headers: {
                "Content-Type": "application/json",
            },
        };
        console.log(id, "testing");

        const { data, status } = await axios.post(
            `/auth/register/user/${id}`,
            userData
        );

        if (status == 200) {
            dispatch({
                type: REGISTER_USER_SUCCESS,
                payload: data,
            });
            route.push("/auth/login");
            toast.success("Register is successfully!");
        } else {
            throw data;
            toast.error(data?.message);
        }
    } catch (error: any) {
        dispatch({
            type: REGISTER_USER_FAIL,
            payload: error.response?.data?.message,
        });
    }
};

// Loader user
export const loadUser = (token: string, router: any) => async (dispatch: any) => {
    // let token = getCookie("token");
    const config = {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    };

    try {
        dispatch({ type: LOAD_USER_REQUEST });

        const res = await axios.get("/auth/me", config);
        const { data, status } = res;
        // console.log("load user :", data)

        if (status == 200) {
            dispatch({
                type: LOAD_USER_SUCCESS,
                payload: res,
            });
            if (data?.refreshToken) {
                setCookie("accessToken", data?.refreshToken);
            }
        } else {
            throw data;
        }
    } catch (error: any) {
        let { data, status } = error?.response;
        console.log(error?.response, "error load");
        switch (status) {
            case 401:
                toast?.error(data?.error);
                removeCookie("accessToken");
                removeCookie("access");
                dispatch({
                    type: LOAD_USER_FAIL,
                    payload: data?.error,
                });
                router.push("/auth/login");
                break;
            default:
                toast?.error(data?.error);
                dispatch({
                    type: LOAD_USER_FAIL,
                    payload: data?.message,
                });
                break;
        }
    }
};

// Loader user roles
export const loadUserRoles = (token: string, router: any) => async (dispatch: any) => {
    // let token = getCookie("token");
    const config = {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    };

    try {
        dispatch({ type: USER_ROLES_REQUEST });

        const res = await axios.get("/auth/getRoles", config);
        const { data, status } = res;

        if (status == 200) {
            dispatch({
                type: USER_ROLES_SUCCESS,
                payload: res,
            });
        } else {
            throw data;
        }
    } catch (error: any) {
        let { data, status } = error?.response;
        console.log(error?.response, "error load");
        switch (status) {
            case 401:
                toast?.error(data?.message);
                removeCookie("accessToken");
                removeCookie("refreshToken");
                dispatch({
                    type: USER_ROLES_FAIL,
                    payload: data?.message,
                });
                router.push("/auth/login");
                break;
            default:
                toast?.error(data?.message);
                dispatch({
                    type: USER_ROLES_FAIL,
                    payload: data?.message,
                });
                break;
        }
    }
};

// Update Profile
export const updateProfile = (userData: any) => async (dispatch: any) => {
    try {
        dispatch({ type: UPDATE_PROFILE_REQUEST });

        const config = {
            headers: {
                "Content-Type": "application/json",
            },
        };

        const { data } = await axios.put("/api/me/update", userData, config);

        dispatch({
            type: UPDATE_PROFILE_SUCCESS,
            payload: data,
        });
    } catch (error: any) {
        dispatch({
            type: UPDATE_PROFILE_FAIL,
            payload: error.response.data.message,
        });
    }
};

// Forgot Password action
export const forgotPassword = (email: string, route: any) => async (dispatch: any) => {
    try {
        dispatch({ type: FORGOT_PASSWORD_REQUEST });

        const config = {
            headers: {
                "Content-Type": "application/json",
            },
        };

        const res = await axios.post("/auth/resetPassword", email, config);
        const { data, status } = res;

        if (status == 200) {
            dispatch({
                type: FORGOT_PASSWORD_SUCCESS,
                payload: data.message,
            });
            route.push("/email");
            toast.success("Please check your email!");
        } else {
            throw data;
            toast.error(data?.message);
        }
    } catch (error: any) {
        const { data } = error?.response;
        await dispatch({
            type: FORGOT_PASSWORD_FAIL,
            payload: data,
        });
    }
};

// Reset Password action
export const resetPassword = (id: number, dataUser: any, route: any) => async (dispatch: any) => {
    try {
        dispatch({ type: RESET_PASSWORD_REQUEST });

        const config = {
            headers: {
                "Content-Type": "application/json",
            },
        };

        const res = await axios.patch(
            `/auth/resetPassword/${id}`,
            dataUser,
            config
        );
        const { data, status } = res;

        console.log(res);

        if (status == 200) {
            dispatch({
                type: RESET_PASSWORD_SUCCESS,
                payload: data,
            });
            route.push("/auth/login");
            toast.success("Reset password successfully");
        } else {
            throw data;
            route.push("/404");
            toast.error(data?.message);
        }
    } catch (error: any) {
        dispatch({
            type: RESET_PASSWORD_FAIL,
            payload: error.response?.data.message,
        });
    }
};

export const getUserDetails = (id: number) => async (dispatch: any) => {
    try {
        dispatch({ type: USER_DETAILS_REQUEST });

        const { data } = await axios.get(`/api/admin/users/${id}`);

        dispatch({
            type: USER_DETAILS_SUCCESS,
            payload: data.user,
        });
    } catch (error: any) {
        dispatch({
            type: USER_DETAILS_FAIL,
            payload: error.response.data.message,
        });
    }
};

// update user profile-info
export const updateUser = (token: string, userData: any, callback: any) => async (dispatch: any) => {
    try {
        dispatch({ type: UPDATE_USER_REQUEST });

        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        };

        const { data, status } = await axios.patch(`user/`, userData, config);
        console.log(data, 'res', status)

        if (status == 200) {
            await dispatch({
                type: UPDATE_USER_SUCCESS,
                payload: data,
            });
            await toast.success(data?.message || "Update profile success.")
            await callback()
        } else {
            throw data
        }
    } catch (error: any) {
        const { data } = error?.response;
        await dispatch({
            type: UPDATE_USER_FAIL,
            payload: data,
        });
        toast.error(data?.message[0])
    }
};

// update user profile-document
export const updateUserDoc = (token: string, userData: any, callback: any) => async (dispatch: any) => {
    try {
        dispatch({ type: UPDATE_USER_REQUEST });

        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        };

        const res = await axios.patch(`user/documentSource`, userData, config);
        const { data, status } = res;
        console.log(res, 'res', status)

        if (status == 200) {
            await dispatch({
                type: UPDATE_USER_SUCCESS,
                payload: data,
            });
            await toast.success(data?.message || "Update document source is success.")
            await callback()
        } else {
            throw data
        }
    } catch (error: any) {
        // const { data } = error?.response;
        await dispatch({
            type: UPDATE_USER_FAIL,
            payload: error?.response,
        });
        toast.error(error?.response?.data?.error)
    }
};

export const deleteUser = (id: number) => async (dispatch: any) => {
    try {
        dispatch({ type: DELETE_USER_REQUEST });

        const { data } = await axios.delete(`/api/admin/users/${id}`);

        dispatch({
            type: DELETE_USER_SUCCESS,
            payload: data.success,
        });
    } catch (error: any) {
        dispatch({
            type: DELETE_USER_FAIL,
            payload: error.response.data.message,
        });
    }
};

export const logoutUser = (token: string, route: any) => async (dispatch: any) => {
    try {
        dispatch({ type: LOGOUT_USER_REQUEST });

        const config = {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${token}`,
            },
        };

        const res = await axios.get("/auth/web/logout", config);
        let { data, status } = res;
        // console.log("resp: ", res)

        if (status == 200) {
            dispatch({
                type: LOGOUT_USER_SUCCESS,
            });
            removeCookie("accessToken");
            removeCookie("refreshToken");
            removeCookie("access");
            removeCookie("accessId");
            route.push("/auth/login");
            toast.success("Sign out is successfully!");
        } else {
            throw data;
        }
    } catch (error: any) {
        toast.error("Sign Out's failed!");
        dispatch({
            type: LOGOUT_USER_FAIL,
        });
    }
};

// Clear Errors
export const clearErrors = () => async (dispatch: any) => {
    dispatch({
        type: CLEAR_ERRORS,
    });
};

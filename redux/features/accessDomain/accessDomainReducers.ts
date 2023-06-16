import {
    Action,
    AnyAction,
    createAsyncThunk,
    createSlice,
} from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';
import type { RootState } from '../../store';

// here we are typing the types for the state
export type DomainState = {
    domains: any,
    domain: any,
    pending: boolean;
    error: boolean;
    message: any;
};

const initialState: DomainState = {
    domains: {},
    domain: {},
    pending: false,
    error: false,
    message: "",
};

interface HeadersConfiguration {
    params?: any,
    headers: {
        "Content-Type"?: string;
        "Accept"?: string
        "Authorization"?: string
    }
}

interface DomainData {
    id?: any;
    data: any;
    token?: any;
    isSuccess: () => void
    isError: () => void
}

interface DefaultGetData {
    id?: any;
    token?: any;
    params?: any;
}

// rejection
interface RejectedAction extends Action {
    error: Error
}

function isRejectedAction(action: AnyAction): action is RejectedAction {
    return action.type.endsWith('rejected')
}

// domain
export const getDomain = createAsyncThunk<any, DefaultGetData, { state: RootState }>('/domain', async (params, { getState }) => {
    let config: HeadersConfiguration = {
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${params.token}`
        },
    };
    try {
        const response = await axios.get("domain", config);
        const { data, status } = response;
        if (status == 200) {
            return data
        } else {
            throw response
        }
    } catch (error: any) {
        const { data, status } = error.response;
        let newError: any = { message: data.message[0] }
        toast.dark(newError.message)
        if (error.response && error.response.status === 404) {
            throw new Error('User not found');
        } else {
            throw new Error(newError.message);
        }
    }
});

export const getDomainId = createAsyncThunk<any, DefaultGetData, { state: RootState }>('/domain/{id}', async (params, { getState }) => {
    let config: HeadersConfiguration = {
        params: params?.params,
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${params.token}`
        },
    };
    try {
        const response = await axios.get(`domain/${params.id}`, config);
        const { data, status } = response;
        if (status == 200) {
            return data
        } else {
            throw response
        }
    } catch (error: any) {
        const { data, status } = error.response;
        let newError: any = { message: data.message[0] }
        toast.dark(newError.message)
        if (error.response && error.response.status === 404) {
            throw new Error('User not found');
        } else {
            throw new Error(newError.message);
        }
    }
});

export const getAccessDomain = createAsyncThunk<any, DefaultGetData, { state: RootState }>('auth/web/access/domain', async (params, { getState }) => {
    let config: HeadersConfiguration = {
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${params.token}`
        },
    };
    try {
        const response = await axios.get("auth/web/access/domain", config);
        const { data, status } = response;
        if (status == 200) {
            return data
        } else {
            throw response
        }
    } catch (error: any) {
        const { data, status } = error.response;
        let newError: any = { message: data.message[0] }
        toast.dark(newError.message)
        if (error.response && error.response.status === 404) {
            throw new Error('User not found');
        } else {
            throw new Error(newError.message);
        }
    }
});

export const createAccessDomain = createAsyncThunk<any, DomainData, { state: RootState }>('post/web/domain', async (params, { getState }) => {
    let config: HeadersConfiguration = {
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${params.token}`
        },
    };
    try {
        const response = await axios.post("domain", params.data, config);
        const { data, status } = response;
        if (status == 201) {
            params.isSuccess();
            return data
        } else {
            throw response
        }
    } catch (error: any) {
        const { data, status } = error.response;
        let newError: any = { message: data.message[0] }
        toast.dark(newError.message)
        params.isError();
        if (error.response && error.response.status === 404) {
            throw new Error('User not found');
        } else {
            throw new Error(newError.message);
        }
    }
});

// update domain
export const updateAccessDomain = createAsyncThunk<any, DomainData, { state: RootState }>('patch/web/domain', async (params, { getState }) => {
    let config: HeadersConfiguration = {
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${params.token}`
        },
    };
    try {
        const response = await axios.patch(`domain`, params.data, config);
        const { data, status } = response;
        if (status == 200) {
            params.isSuccess();
            return data
        } else {
            throw response
        }
    } catch (error: any) {
        const { data, status } = error.response;
        let newError: any = { message: data.message[0] }
        toast.dark(newError.message)
        params.isError();
        if (error.response && error.response.status === 404) {
            throw new Error('User not found');
        } else {
            throw new Error(newError.message);
        }
    }
});


// SLICER
export const accessDomainSlice = createSlice({
    name: 'accessDomain',
    initialState,
    reducers: {
        // leave this empty here
        resetAccessDomain(state) {
            state.domain = {}
            state.pending = false
            state.error = false
            state.message = ""
        },
    },
    // The `extraReducers` field lets the slice handle actions defined elsewhere, including actions generated by createAsyncThunk or in other slices. 
    // Since this is an API call we have 3 possible outcomes: pending, fulfilled and rejected. We have made allocations for all 3 outcomes. 
    // Doing this is good practice as we can tap into the status of the API call and give our users an idea of what's happening in the background.
    extraReducers: builder => {
        builder
            // get-domain
            .addCase(getDomain.pending, state => {
                return {
                    ...state,
                    pending: true
                }
            })
            .addCase(getDomain.fulfilled, (state, { payload }) => {
                return {
                    ...state,
                    pending: false,
                    error: false,
                    domains: payload
                }
            })
            .addCase(getDomain.rejected, (state, { error }) => {
                state.pending = false;
                state.error = true;
                state.message = error.message;
            })

            // by id
            .addCase(getDomainId.pending, state => {
                return {
                    ...state,
                    pending: true
                }
            })
            .addCase(getDomainId.fulfilled, (state, { payload }) => {
                return {
                    ...state,
                    pending: false,
                    error: false,
                    domain: payload
                }
            })
            .addCase(getDomainId.rejected, (state, { error }) => {
                state.pending = false;
                state.error = true;
                state.message = error.message;
            })

            // get-access-property
            .addCase(getAccessDomain.pending, state => {
                return {
                    ...state,
                    pending: true
                }
            })
            .addCase(getAccessDomain.fulfilled, (state, { payload }) => {
                return {
                    ...state,
                    pending: false,
                    error: false,
                    domains: payload
                }
            })
            .addCase(getAccessDomain.rejected, (state, { error }) => {
                state.pending = false;
                state.error = true;
                state.message = error.message;
            })

            // create-access-property
            .addCase(createAccessDomain.pending, state => {
                return {
                    ...state,
                    pending: true
                }
            })
            .addCase(createAccessDomain.fulfilled, (state, { payload }) => {
                return {
                    ...state,
                    pending: false,
                    error: false
                }
            })
            .addCase(createAccessDomain.rejected, (state, { error }) => {
                state.pending = false;
                state.error = true;
                state.message = error.message;
            })

            // create-access-property
            .addCase(updateAccessDomain.pending, state => {
                return {
                    ...state,
                    pending: true
                }
            })
            .addCase(updateAccessDomain.fulfilled, (state, { payload }) => {
                return {
                    ...state,
                    pending: false,
                    error: false
                }
            })
            .addCase(updateAccessDomain.rejected, (state, { error }) => {
                state.pending = false;
                state.error = true;
                state.message = error.message;
            })

            .addMatcher(isRejectedAction, (state, action) => { })
            .addDefaultCase((state, action) => {
                let base = {
                    ...state,
                    ...action.state
                }
                return base
            })
    }
});
// SLICER

const accessDomainReducers = accessDomainSlice.reducer;

export const { resetAccessDomain } = accessDomainSlice.actions
export const selectAccessDomain = (state: RootState) => state.accessDomain;

export default accessDomainReducers;
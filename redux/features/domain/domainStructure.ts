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
export type DomainStructureState = {
    domainStructures: any,
    domainStructure: any,
    pending: boolean;
    error: boolean;
    message: any;
};

const initialState: DomainStructureState = {
    domainStructures: {},
    domainStructure: {},
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

// get domain access group
export const getDomainStructures = createAsyncThunk<any, DefaultGetData, { state: RootState }>('/domainStructure', async (params, { getState }) => {
    let config: HeadersConfiguration = {
        params: params.params,
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${params.token}`
        },
    };
    try {
        const response = await axios.get("domainStructure", config);
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

export const createDomainStructures = createAsyncThunk<any, DomainData, { state: RootState }>('/post/domainStructure', async (params, { getState }) => {
    let config: HeadersConfiguration = {
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${params.token}`
        },
    };
    try {
        const response = await axios.post("domainStructure", params.data, config);
        const { data, status } = response;
        if (status == 201) {
            params.isSuccess()
            return data
        } else {
            throw response
        }
    } catch (error: any) {
        const { data, status } = error.response;
        let newError: any = { message: data.message[0] }
        params.isError()
        toast.dark(newError.message)
        if (error.response && error.response.status === 404) {
            throw new Error('User not found');
        } else {
            throw new Error(newError.message);
        }
    }
});

export const updateDomainStructures = createAsyncThunk<any, DomainData, { state: RootState }>('/update/domainStructure', async (params, { getState }) => {
    let config: HeadersConfiguration = {
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${params.token}`
        },
    };
    try {
        const response = await axios.patch(`domainStructure/${params.id}`, params.data, config);
        const { data, status } = response;
        if (status == 200) {
            params.isSuccess()
            return data
        } else {
            throw response
        }
    } catch (error: any) {
        const { data, status } = error.response;
        let newError: any = { message: data.message[0] }
        params.isError()
        toast.dark(newError.message)
        if (error.response && error.response.status === 404) {
            throw new Error('User not found');
        } else {
            throw new Error(newError.message);
        }
    }
});

export const deleteDomainStructures = createAsyncThunk<any, DomainData, { state: RootState }>('/delete/domainStructures/', async (params, { getState }) => {
    let config: HeadersConfiguration = {
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${params.token}`
        },
    };
    try {
        const response = await axios.delete(`domainStructure`, { data: params.data, headers: config.headers });
        const { data, status } = response;
        if (status == 204) {
            params.isSuccess()
            return data
        } else {
            throw response
        }
    } catch (error: any) {
        const { data, status } = error.response;
        let newError: any = { message: data.message[0] }
        params.isError()
        toast.dark(newError.message)
        if (error.response && error.response.status === 404) {
            throw new Error('User not found');
        } else {
            throw new Error(newError.message);
        }
    }
});

export const deleteDomainStructureById = createAsyncThunk<any, DomainData, { state: RootState }>('/delete/domainStructures/id', async (params, { getState }) => {
    let config: HeadersConfiguration = {
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${params.token}`
        },
    };
    try {
        const response = await axios.delete(`domainStructure/${params.id}`, config);
        const { data, status } = response;
        if (status == 204) {
            params.isSuccess()
            return data
        } else {
            throw response
        }
    } catch (error: any) {
        const { data, status } = error.response;
        let newError: any = { message: data.message[0] }
        params.isError()
        toast.dark(newError.message)
        if (error.response && error.response.status === 404) {
            throw new Error('User not found');
        } else {
            throw new Error(newError.message);
        }
    }
});

// get by id
export const getDomainStructureById = createAsyncThunk<any, DefaultGetData, { state: RootState }>('/domainStructure/id', async (params, { getState }) => {
    let config: HeadersConfiguration = {
        params: params.params,
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${params.token}`
        },
    };
    try {
        const response = await axios.get(`domainStructure/${params.id}`, config);
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


// SLICER
export const domainStructureSlice = createSlice({
    name: 'domainStructures',
    initialState,
    reducers: {
        // leave this empty here
        resetDomainStructure(state) {
            state.domainStructure = {}
            state.pending = false
            state.error = false
            state.message = ""
        },
    },
    // The `extraReducers` field lets the slice handle actions defined elsewhere, including actions generated by createAsyncThunk or in other slices. 
    // Since this is an API call we have 3 possible outcomes: pending, fulfilled and rejected. We have made allocations for all 3 outcomes. 
    // Doing this is good practice as we can tap into the status of the API call and give our users an idea of what's happening in the background.
    // create-domain-access-group

    extraReducers: builder => {
        builder
            // get-domain-structures
            .addCase(getDomainStructures.pending, state => {
                return {
                    ...state,
                    pending: true
                }
            })
            .addCase(getDomainStructures.fulfilled, (state, { payload }) => {
                return {
                    ...state,
                    pending: false,
                    error: false,
                    domainStructures: payload
                }
            })
            .addCase(getDomainStructures.rejected, (state, { error }) => {
                state.pending = false;
                state.error = true;
                state.message = error.message;
            })

            // create domain structures
            .addCase(createDomainStructures.pending, state => {
                return {
                    ...state,
                    pending: true
                }
            })
            .addCase(createDomainStructures.fulfilled, (state, { payload }) => {
                return {
                    ...state,
                    pending: false,
                    error: false
                }
            })
            .addCase(createDomainStructures.rejected, (state, { error }) => {
                state.pending = false;
                state.error = true;
                state.message = error.message;
            })

            // update domain structures
            .addCase(updateDomainStructures.pending, state => {
                return {
                    ...state,
                    pending: true
                }
            })
            .addCase(updateDomainStructures.fulfilled, (state, { payload }) => {
                return {
                    ...state,
                    pending: false,
                    error: false
                }
            })
            .addCase(updateDomainStructures.rejected, (state, { error }) => {
                state.pending = false;
                state.error = true;
                state.message = error.message;
            })

            // delete by arr id
            .addCase(deleteDomainStructures.pending, state => {
                return {
                    ...state,
                    pending: true
                }
            })
            .addCase(deleteDomainStructures.fulfilled, (state, { payload }) => {
                return {
                    ...state,
                    pending: false,
                    error: false
                }
            })
            .addCase(deleteDomainStructures.rejected, (state, { error }) => {
                state.pending = false;
                state.error = true;
                state.message = error.message;
            })

            // delete by id
            .addCase(deleteDomainStructureById.pending, state => {
                return {
                    ...state,
                    pending: true
                }
            })
            .addCase(deleteDomainStructureById.fulfilled, (state, { payload }) => {
                return {
                    ...state,
                    pending: false,
                    error: false
                }
            })
            .addCase(deleteDomainStructureById.rejected, (state, { error }) => {
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

const domainStructureReducers = domainStructureSlice.reducer;

export const { resetDomainStructure } = domainStructureSlice.actions
export const selectDomainStructures = (state: RootState) => state.domainStructures;

export default domainStructureReducers;
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
export type PropertyTypeState = {
    propertyTypes: any,
    propertyType: any,
    pending: boolean;
    error: boolean;
    message: any;
};

const initialState: PropertyTypeState = {
    propertyTypes: {},
    propertyType: {},
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

interface PropertyTypeData {
    id?: any;
    data?: any;
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

// domain-property
export const getPropertyType = createAsyncThunk<any, DefaultGetData, { state: RootState }>('property-type', async (params, { getState }) => {
    let config: HeadersConfiguration = {
        params: params.params,
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${params.token}`
        },
    };
    try {
        const response = await axios.get("propertyType", config);
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

// get property by id
export const getPropertyTypeById = createAsyncThunk<any, DefaultGetData, { state: RootState }>('property-type/id', async (params, { getState }) => {
    let config: HeadersConfiguration = {
        params: params.params,
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${params.token}`
        },
    };
    try {
        const response = await axios.get(`propertyType/${params.id}`, config);
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

export const createPropertyType = createAsyncThunk<any, PropertyTypeData, { state: RootState }>('create/property-type', async (params, { getState }) => {
    let config: HeadersConfiguration = {
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${params.token}`
        },
    };
    try {
        const response = await axios.post("propertyType", params.data, config);
        const { data, status } = response;
        if (status == 201) {
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

export const updatePropertyType = createAsyncThunk<any, PropertyTypeData, { state: RootState }>('update/property-type', async (params, { getState }) => {
    let config: HeadersConfiguration = {
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${params.token}`
        },
    };
    try {
        const response = await axios.patch(`propertyType/${params.id}`, params.data, config);
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
        toast.dark(newError.message)
        if (error.response && error.response.status === 404) {
            throw new Error('User not found');
        } else {
            throw new Error(newError.message);
        }
    }
});


// SLICER
export const propertyTypeSlice = createSlice({
    name: 'propertyType',
    initialState,
    reducers: {
        // leave this empty here
        resetPropertyType(state) {
            state.propertyType = {}
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
            // get-domain-property
            .addCase(getPropertyType.pending, state => {
                return {
                    ...state,
                    pending: true
                }
            })
            .addCase(getPropertyType.fulfilled, (state, { payload }) => {
                return {
                    ...state,
                    pending: false,
                    error: false,
                    propertyTypes: payload
                }
            })
            .addCase(getPropertyType.rejected, (state, { error }) => {
                state.pending = false;
                state.error = true;
                state.message = error.message;
            })

            // get-domain-property
            .addCase(getPropertyTypeById.pending, state => {
                return {
                    ...state,
                    pending: true
                }
            })
            .addCase(getPropertyTypeById.fulfilled, (state, { payload }) => {
                return {
                    ...state,
                    pending: false,
                    error: false,
                    propertyType: payload
                }
            })
            .addCase(getPropertyTypeById.rejected, (state, { error }) => {
                state.pending = false;
                state.error = true;
                state.message = error.message;
            })

            // create-domain-property
            .addCase(createPropertyType.pending, state => {
                return {
                    ...state,
                    pending: true
                }
            })
            .addCase(createPropertyType.fulfilled, (state, { payload }) => {
                return {
                    ...state,
                    pending: false,
                    error: false
                }
            })
            .addCase(createPropertyType.rejected, (state, { error }) => {
                state.pending = false;
                state.error = true;
                state.message = error.message;
            })

            // update-domain-property
            .addCase(updatePropertyType.pending, state => {
                return {
                    ...state,
                    pending: true
                }
            })
            .addCase(updatePropertyType.fulfilled, (state, { payload }) => {
                return {
                    ...state,
                    pending: false,
                    error: false
                }
            })
            .addCase(updatePropertyType.rejected, (state, { error }) => {
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

const propertyTypeReducers = propertyTypeSlice.reducer;

export const { resetPropertyType } = propertyTypeSlice.actions
export const selectPropertyType = (state: RootState) => state.propertyType;

export default propertyTypeReducers;
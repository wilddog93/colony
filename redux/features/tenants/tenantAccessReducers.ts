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
export type TenantState = {
    tenants: any,
    tenant: any,
    pending: boolean;
    error: boolean;
    message: any;
};

const initialState: TenantState = {
    tenants: {},
    tenant: {},
    pending: false,
    error: false,
    message: "",
};

interface HeadersConfiguration {
    headers: {
        "Content-Type"?: string;
        "Accept"?: string
        "Authorization"?: string
    }
}

interface tenantData {
    data: any;
    token?: any;
    callback: () => void
}

interface DefaultGetData {
    token?: any,
    params?: any
}

// rejection
interface RejectedAction extends Action {
    error: Error
}

function isRejectedAction(action: AnyAction): action is RejectedAction {
    return action.type.endsWith('rejected')
}

// Auth me
export const getAccessTenant = createAsyncThunk<any, DefaultGetData, { state: RootState }>('auth/web/access/tenant', async (params, { getState }) => {
    let config: HeadersConfiguration = {
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${params.token}`
        },
    };
    try {
        const response = await axios.get("auth/web/access/unit", config);
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
export const tenantSlice = createSlice({
    name: 'tenantAccess',
    initialState,
    reducers: {
        // leave this empty here
        resetTenantAccess(state) {
            state.tenant = {}
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
            // get-access-tenant
            .addCase(getAccessTenant.pending, state => {
                return {
                    ...state,
                    pending: true
                }
            })
            .addCase(getAccessTenant.fulfilled, (state, { payload }) => {
                return {
                    ...state,
                    pending: false,
                    error: false,
                    tenants: payload
                }
            })
            .addCase(getAccessTenant.rejected, (state, { error }) => {
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

const tenantAccessReducers = tenantSlice.reducer;

export const { resetTenantAccess } = tenantSlice.actions
export const selecttTenantAccess = (state: RootState) => state.tenantAccess;

export default tenantAccessReducers;
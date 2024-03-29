import {
  Action,
  AnyAction,
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import type { RootState } from "../../../store";

// here we are typing the types for the state
export type BillingHistoryState = {
  unitBillings: any;
  unitBilling: any;
  pending: boolean;
  error: boolean;
  message: any;
};

const initialState: BillingHistoryState = {
  unitBillings: {},
  unitBilling: {},
  pending: false,
  error: false,
  message: "",
};

interface HeadersConfiguration {
  params?: any;
  headers: {
    "Content-Type"?: string;
    Accept?: string;
    Authorization?: string;
  };
}

interface UnitBillingData {
  id?: any;
  data?: any;
  token?: any;
  isSuccess: () => void;
  isError: () => void;
}

interface DefaultGetData {
  id?: any;
  token?: any;
  params?: any;
}

// rejection
interface RejectedAction extends Action {
  error: Error;
}

function isRejectedAction(action: AnyAction): action is RejectedAction {
  return action.type.endsWith("rejected");
}

// unit-billing-history
export const getUnitBilling = createAsyncThunk<
  any,
  DefaultGetData,
  { state: RootState }
>("api/billing", async (params, { getState }) => {
  let config: HeadersConfiguration = {
    params: params.params,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${params.token}`,
    },
  };
  try {
    const response = await axios.get("api/myUnit/billing", config);
    const { data, status } = response;
    if (status == 200) {
      return data;
    } else {
      throw response;
    }
  } catch (error: any) {
    const { data, status } = error.response;
    let newError: any = { message: data.message[0] };
    toast.dark(newError.message);
    if (error.response && error.response.status === 404) {
      throw new Error("User not found");
    } else {
      throw new Error(newError.message);
    }
  }
});

// get property by id
export const getUnitBillingById = createAsyncThunk<
  any,
  DefaultGetData,
  { state: RootState }
>("unitBilling/id", async (params, { getState }) => {
  let config: HeadersConfiguration = {
    params: params.params,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${params.token}`,
    },
  };
  try {
    const response = await axios.get(`api/unitBilling/${params.id}`, config);
    const { data, status } = response;
    if (status == 200) {
      return data;
    } else {
      throw response;
    }
  } catch (error: any) {
    const { data, status } = error.response;
    let newError: any = { message: data.message[0] };
    toast.dark(newError.message);
    if (error.response && error.response.status === 404) {
      throw new Error("User not found");
    } else {
      throw new Error(newError.message);
    }
  }
});

// SLICER
export const unitBillingslice = createSlice({
  name: "unitBilling",
  initialState,
  reducers: {
    // leave this empty here
    resetUnitBilling(state) {
      state.unitBilling = {};
      state.pending = false;
      state.error = false;
      state.message = "";
    },
  },
  // The `extraReducers` field lets the slice handle actions defined elsewhere, including actions generated by createAsyncThunk or in other slices.
  // Since this is an API call we have 3 possible outcomes: pending, fulfilled and rejected. We have made allocations for all 3 outcomes.
  // Doing this is good practice as we can tap into the status of the API call and give our users an idea of what's happening in the background.
  extraReducers: (builder) => {
    builder
      // get-domain-property
      .addCase(getUnitBilling.pending, (state) => {
        return {
          ...state,
          pending: true,
        };
      })
      .addCase(getUnitBilling.fulfilled, (state, { payload }) => {
        return {
          ...state,
          pending: false,
          error: false,
          unitBillings: payload,
        };
      })
      .addCase(getUnitBilling.rejected, (state, { error }) => {
        state.pending = false;
        state.error = true;
        state.message = error.message;
      })

      // get-domain-property
      .addCase(getUnitBillingById.pending, (state) => {
        return {
          ...state,
          pending: true,
        };
      })
      .addCase(getUnitBillingById.fulfilled, (state, { payload }) => {
        return {
          ...state,
          pending: false,
          error: false,
          unitBilling: payload,
        };
      })
      .addCase(getUnitBillingById.rejected, (state, { error }) => {
        state.pending = false;
        state.error = true;
        state.message = error.message;
      })

      .addMatcher(isRejectedAction, (state, action) => {})
      .addDefaultCase((state, action) => {
        let base = {
          ...state,
          ...action.state,
        };
        return base;
      });
  },
});
// SLICER

const unitBillingReducers = unitBillingslice.reducer;

export const { resetUnitBilling } = unitBillingslice.actions;
export const selectUnitBilling = (state: RootState) => state.unitBilling;

export default unitBillingReducers;

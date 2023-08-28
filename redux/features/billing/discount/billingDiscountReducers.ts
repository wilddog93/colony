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
export type BillingDiscountState = {
  billingDiscounts: any;
  billingDiscount: any;
  pending: boolean;
  error: boolean;
  message: any;
};

const initialState: BillingDiscountState = {
  billingDiscounts: {},
  billingDiscount: {},
  pending: false,
  error: false,
  message: "",
};

interface HeadersConfiguration {
  data?: any;
  params?: any;
  headers: {
    "Content-Type"?: string;
    Accept?: string;
    Authorization?: string;
  };
}

interface BillingDiscountData {
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

// get all billing
export const getBillingDiscount = createAsyncThunk<
  any,
  DefaultGetData,
  { state: RootState }
>("/billingDiscount", async (params, { getState }) => {
  let config: HeadersConfiguration = {
    params: params.params,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${params.token}`,
    },
  };
  try {
    const response = await axios.get("billingDiscount", config);
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

// get by id
export const getBillingDiscountById = createAsyncThunk<
  any,
  DefaultGetData,
  { state: RootState }
>("/billingDiscount/id", async (params, { getState }) => {
  let config: HeadersConfiguration = {
    params: params.params,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${params.token}`,
    },
  };
  try {
    const response = await axios.get(`billingDiscount/${params.id}`, config);
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

// create-billing
export const createBillingDiscount = createAsyncThunk<
  any,
  BillingDiscountData,
  { state: RootState }
>("/billingDiscount/create", async (params, { getState }) => {
  let config: HeadersConfiguration = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${params.token}`,
    },
  };
  try {
    const response = await axios.post("billingDiscount", params.data, config);
    const { data, status } = response;
    if (status == 201) {
      params.isSuccess();
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

// update
export const updateBillingDiscount = createAsyncThunk<
  any,
  BillingDiscountData,
  { state: RootState }
>("/billingDiscount/update", async (params, { getState }) => {
  let config: HeadersConfiguration = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${params.token}`,
    },
  };
  try {
    const response = await axios.patch(
      `billingDiscount/${params.id}`,
      params.data,
      config
    );
    const { data, status } = response;
    if (status == 200) {
      params.isSuccess();
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

// delete
export const deleteBillingDiscount = createAsyncThunk<
  any,
  BillingDiscountData,
  { state: RootState }
>("/billingDiscount/delete", async (params, { getState }) => {
  let config: HeadersConfiguration = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${params.token}`,
    },
  };
  try {
    const response = await axios.delete(`billingDiscount/${params.id}`, config);
    const { data, status } = response;
    if (status == 204) {
      params.isSuccess();
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
export const billingDiscountSlice = createSlice({
  name: "billing-discount",
  initialState,
  reducers: {
    // leave this empty here
    resetBillingDiscount(state) {
      state.billingDiscount = {};
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
      // get-billingDiscounts
      .addCase(getBillingDiscount.pending, (state) => {
        return {
          ...state,
          pending: true,
        };
      })
      .addCase(getBillingDiscount.fulfilled, (state, { payload }) => {
        return {
          ...state,
          pending: false,
          error: false,
          billingDiscounts: payload,
        };
      })
      .addCase(getBillingDiscount.rejected, (state, { error }) => {
        state.pending = false;
        state.error = true;
        state.message = error.message;
      })

      // get-billing-id
      .addCase(getBillingDiscountById.pending, (state) => {
        return {
          ...state,
          pending: true,
        };
      })
      .addCase(getBillingDiscountById.fulfilled, (state, { payload }) => {
        return {
          ...state,
          pending: false,
          error: false,
          billingDiscount: payload,
        };
      })
      .addCase(getBillingDiscountById.rejected, (state, { error }) => {
        state.pending = false;
        state.error = true;
        state.message = error.message;
      })

      // create-billing-order
      .addCase(createBillingDiscount.pending, (state) => {
        return {
          ...state,
          pending: true,
        };
      })
      .addCase(createBillingDiscount.fulfilled, (state, { payload }) => {
        return {
          ...state,
          pending: false,
          error: false,
        };
      })
      .addCase(createBillingDiscount.rejected, (state, { error }) => {
        state.pending = false;
        state.error = true;
        state.message = error.message;
      })

      // update-billing
      .addCase(updateBillingDiscount.pending, (state) => {
        return {
          ...state,
          pending: true,
        };
      })
      .addCase(updateBillingDiscount.fulfilled, (state, { payload }) => {
        return {
          ...state,
          pending: false,
          error: false,
        };
      })
      .addCase(updateBillingDiscount.rejected, (state, { error }) => {
        state.pending = false;
        state.error = true;
        state.message = error.message;
      })

      // delete-billing
      .addCase(deleteBillingDiscount.pending, (state) => {
        return {
          ...state,
          pending: true,
        };
      })
      .addCase(deleteBillingDiscount.fulfilled, (state, { payload }) => {
        return {
          ...state,
          pending: false,
          error: false,
        };
      })
      .addCase(deleteBillingDiscount.rejected, (state, { error }) => {
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

const billingDiscountManagementReducers = billingDiscountSlice.reducer;

export const { resetBillingDiscount } = billingDiscountSlice.actions;
export const selectBillingDiscountManagement = (state: RootState) =>
  state.billingDiscountManagement;

export default billingDiscountManagementReducers;

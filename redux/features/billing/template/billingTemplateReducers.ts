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
export type BillingTemplateState = {
  billingTemplates: any;
  billingTemplate: any;
  pending: boolean;
  error: boolean;
  message: any;
};

const initialState: BillingTemplateState = {
  billingTemplates: {},
  billingTemplate: {},
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

interface BillingTemplateData {
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
export const getBillingTemplate = createAsyncThunk<
  any,
  DefaultGetData,
  { state: RootState }
>("/billingTemplate", async (params, { getState }) => {
  let config: HeadersConfiguration = {
    params: params.params,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${params.token}`,
    },
  };
  try {
    const response = await axios.get("api/billingTemplate", config);
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
export const getBillingTemplateById = createAsyncThunk<
  any,
  DefaultGetData,
  { state: RootState }
>("/api/billingTemplate/id", async (params, { getState }) => {
  let config: HeadersConfiguration = {
    params: params.params,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${params.token}`,
    },
  };
  try {
    const response = await axios.get(
      `api/billingTemplate/${params.id}`,
      config
    );
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
export const createBillingTemplate = createAsyncThunk<
  any,
  BillingTemplateData,
  { state: RootState }
>("/api/billingTemplate/create", async (params, { getState }) => {
  let config: HeadersConfiguration = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${params.token}`,
    },
  };
  try {
    const response = await axios.post("billingTemplate", params.data, config);
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
export const updateBillingTemplate = createAsyncThunk<
  any,
  BillingTemplateData,
  { state: RootState }
>("/api/billingTemplate/update", async (params, { getState }) => {
  let config: HeadersConfiguration = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${params.token}`,
    },
  };
  try {
    const response = await axios.patch(
      `api/billingTemplate/${params.id}`,
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
export const deleteBillingTemplate = createAsyncThunk<
  any,
  BillingTemplateData,
  { state: RootState }
>("/api/billingTemplate/delete", async (params, { getState }) => {
  let config: HeadersConfiguration = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${params.token}`,
    },
  };
  try {
    const response = await axios.delete(
      `api/billingTemplate/${params.id}`,
      config
    );
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
export const billingTemplateSlice = createSlice({
  name: "billing-template",
  initialState,
  reducers: {
    // leave this empty here
    resetBillingTemplate(state) {
      state.billingTemplate = {};
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
      // get-billingTemplates
      .addCase(getBillingTemplate.pending, (state) => {
        return {
          ...state,
          pending: true,
        };
      })
      .addCase(getBillingTemplate.fulfilled, (state, { payload }) => {
        return {
          ...state,
          pending: false,
          error: false,
          billingTemplates: payload,
        };
      })
      .addCase(getBillingTemplate.rejected, (state, { error }) => {
        state.pending = false;
        state.error = true;
        state.message = error.message;
      })

      // get-billing-id
      .addCase(getBillingTemplateById.pending, (state) => {
        return {
          ...state,
          pending: true,
        };
      })
      .addCase(getBillingTemplateById.fulfilled, (state, { payload }) => {
        return {
          ...state,
          pending: false,
          error: false,
          billingTemplate: payload,
        };
      })
      .addCase(getBillingTemplateById.rejected, (state, { error }) => {
        state.pending = false;
        state.error = true;
        state.message = error.message;
      })

      // create-billing-order
      .addCase(createBillingTemplate.pending, (state) => {
        return {
          ...state,
          pending: true,
        };
      })
      .addCase(createBillingTemplate.fulfilled, (state, { payload }) => {
        return {
          ...state,
          pending: false,
          error: false,
        };
      })
      .addCase(createBillingTemplate.rejected, (state, { error }) => {
        state.pending = false;
        state.error = true;
        state.message = error.message;
      })

      // update-billing
      .addCase(updateBillingTemplate.pending, (state) => {
        return {
          ...state,
          pending: true,
        };
      })
      .addCase(updateBillingTemplate.fulfilled, (state, { payload }) => {
        return {
          ...state,
          pending: false,
          error: false,
        };
      })
      .addCase(updateBillingTemplate.rejected, (state, { error }) => {
        state.pending = false;
        state.error = true;
        state.message = error.message;
      })

      // delete-billing
      .addCase(deleteBillingTemplate.pending, (state) => {
        return {
          ...state,
          pending: true,
        };
      })
      .addCase(deleteBillingTemplate.fulfilled, (state, { payload }) => {
        return {
          ...state,
          pending: false,
          error: false,
        };
      })
      .addCase(deleteBillingTemplate.rejected, (state, { error }) => {
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

const billingTemplateManagementReducers = billingTemplateSlice.reducer;

export const { resetBillingTemplate } = billingTemplateSlice.actions;
export const selectBillingTemplateManagement = (state: RootState) =>
  state.billingTemplateManagement;

export default billingTemplateManagementReducers;

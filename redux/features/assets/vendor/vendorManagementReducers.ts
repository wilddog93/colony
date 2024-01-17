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
export type VendorState = {
  vendors: any;
  vendor: any;
  pending: boolean;
  error: boolean;
  message: any;
};

const initialState: VendorState = {
  vendors: {},
  vendor: {},
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

interface VendorData {
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

// get all vendor
export const getVendors = createAsyncThunk<
  any,
  DefaultGetData,
  { state: RootState }
>("/vendor", async (params, { getState }) => {
  let config: HeadersConfiguration = {
    params: params.params,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${params.token}`,
    },
  };
  try {
    const response = await axios.get("api/vendor", config);
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
export const getVendorById = createAsyncThunk<
  any,
  DefaultGetData,
  { state: RootState }
>("/vendor/id", async (params, { getState }) => {
  let config: HeadersConfiguration = {
    params: params.params,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${params.token}`,
    },
  };
  try {
    const response = await axios.get(`api/vendor/${params.id}`, config);
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

// create
export const createVendor = createAsyncThunk<
  any,
  VendorData,
  { state: RootState }
>("/vendor/create", async (params, { getState }) => {
  let config: HeadersConfiguration = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${params.token}`,
    },
  };
  try {
    const response = await axios.post("api/vendor", params.data, config);
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
export const updateVendor = createAsyncThunk<
  any,
  VendorData,
  { state: RootState }
>("/vendor/update", async (params, { getState }) => {
  let config: HeadersConfiguration = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${params.token}`,
    },
  };
  try {
    const response = await axios.patch(
      `api/vendor/${params.id}`,
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
export const deleteVendor = createAsyncThunk<
  any,
  VendorData,
  { state: RootState }
>("/vendor/delete", async (params, { getState }) => {
  let config: HeadersConfiguration = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${params.token}`,
    },
  };
  try {
    const response = await axios.delete(`api/vendor/${params.id}`, config);
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
export const vendorSlice = createSlice({
  name: "vendors",
  initialState,
  reducers: {
    // leave this empty here
    resetVendor(state) {
      state.vendor = {};
      state.pending = false;
      state.error = false;
      state.message = "";
    },
  },
  // The `extraReducers` field lets the slice handle actions defined elsewhere, including actions generated by createAsyncThunk or in other slices.
  // Since this is an API call we have 3 possible outcomes: pending, fulfilled and rejected. We have made alvendors for all 3 outcomes.
  // Doing this is good practice as we can tap into the status of the API call and give our users an idea of what's happening in the background.
  extraReducers: (builder) => {
    builder
      // get-vendors
      .addCase(getVendors.pending, (state) => {
        return {
          ...state,
          pending: true,
        };
      })
      .addCase(getVendors.fulfilled, (state, { payload }) => {
        return {
          ...state,
          pending: false,
          error: false,
          vendors: payload,
        };
      })
      .addCase(getVendors.rejected, (state, { error }) => {
        state.pending = false;
        state.error = true;
        state.message = error.message;
      })

      // get-vendor-id
      .addCase(getVendorById.pending, (state) => {
        return {
          ...state,
          pending: true,
        };
      })
      .addCase(getVendorById.fulfilled, (state, { payload }) => {
        return {
          ...state,
          pending: false,
          error: false,
          vendor: payload,
        };
      })
      .addCase(getVendorById.rejected, (state, { error }) => {
        state.pending = false;
        state.error = true;
        state.message = error.message;
      })

      // create-vendor
      .addCase(createVendor.pending, (state) => {
        return {
          ...state,
          pending: true,
        };
      })
      .addCase(createVendor.fulfilled, (state, { payload }) => {
        return {
          ...state,
          pending: false,
          error: false,
        };
      })
      .addCase(createVendor.rejected, (state, { error }) => {
        state.pending = false;
        state.error = true;
        state.message = error.message;
      })

      // update-vendor
      .addCase(updateVendor.pending, (state) => {
        return {
          ...state,
          pending: true,
        };
      })
      .addCase(updateVendor.fulfilled, (state, { payload }) => {
        return {
          ...state,
          pending: false,
          error: false,
        };
      })
      .addCase(updateVendor.rejected, (state, { error }) => {
        state.pending = false;
        state.error = true;
        state.message = error.message;
      })

      // delete-vendor
      .addCase(deleteVendor.pending, (state) => {
        return {
          ...state,
          pending: true,
        };
      })
      .addCase(deleteVendor.fulfilled, (state, { payload }) => {
        return {
          ...state,
          pending: false,
          error: false,
        };
      })
      .addCase(deleteVendor.rejected, (state, { error }) => {
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

const vendorManagementReducers = vendorSlice.reducer;

export const { resetVendor } = vendorSlice.actions;
export const selectVendorManagement = (state: RootState) =>
  state.vendorManagement;

export default vendorManagementReducers;

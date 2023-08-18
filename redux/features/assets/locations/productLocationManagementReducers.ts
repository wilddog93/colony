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
export type ProductLocationState = {
  productLocations: any;
  productLocation: any;
  pending: boolean;
  error: boolean;
  message: any;
};

const initialState: ProductLocationState = {
  productLocations: {},
  productLocation: {},
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

interface ProductLocationData {
  id?: any;
  locationId?: any;
  data?: any;
  token?: any;
  isSuccess: () => void;
  isError: () => void;
}

interface DefaultGetData {
  id?: any;
  locationId?: any;
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

// get all productLocation
export const getProductLocations = createAsyncThunk<
  any,
  DefaultGetData,
  { state: RootState }
>("/productLocation", async (params, { getState }) => {
  let config: HeadersConfiguration = {
    params: params.params,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${params.token}`,
    },
  };
  try {
    const response = await axios.get("product/location", config);
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
export const getProductLocationById = createAsyncThunk<
  any,
  DefaultGetData,
  { state: RootState }
>("/productLocation/id", async (params, { getState }) => {
  let config: HeadersConfiguration = {
    params: params.params,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${params.token}`,
    },
  };
  try {
    const response = await axios.get(`product/location/${params.id}`, config);
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

// get by location id
export const getProductLocationByLocationId = createAsyncThunk<
  any,
  DefaultGetData,
  { state: RootState }
>("/productLocation/id/locationId", async (params, { getState }) => {
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
      `productLocation/${params.id}/${params?.locationId}`,
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

// SLICER
export const productLocationSlice = createSlice({
  name: "productLocations",
  initialState,
  reducers: {
    // leave this empty here
    resetProductLocation(state) {
      state.productLocation = {};
      state.pending = false;
      state.error = false;
      state.message = "";
    },
  },
  // The `extraReducers` field lets the slice handle actions defined elsewhere, including actions generated by createAsyncThunk or in other slices.
  // Since this is an API call we have 3 possible outcomes: pending, fulfilled and rejected. We have made alproductLocations for all 3 outcomes.
  // Doing this is good practice as we can tap into the status of the API call and give our users an idea of what's happening in the background.
  extraReducers: (builder) => {
    builder
      // get-productLocations
      .addCase(getProductLocations.pending, (state) => {
        return {
          ...state,
          pending: true,
        };
      })
      .addCase(getProductLocations.fulfilled, (state, { payload }) => {
        return {
          ...state,
          pending: false,
          error: false,
          productLocations: payload,
        };
      })
      .addCase(getProductLocations.rejected, (state, { error }) => {
        state.pending = false;
        state.error = true;
        state.message = error.message;
      })

      // get-productLocation-id
      .addCase(getProductLocationById.pending, (state) => {
        return {
          ...state,
          pending: true,
        };
      })
      .addCase(getProductLocationById.fulfilled, (state, { payload }) => {
        return {
          ...state,
          pending: false,
          error: false,
          productLocation: payload,
        };
      })
      .addCase(getProductLocationById.rejected, (state, { error }) => {
        state.pending = false;
        state.error = true;
        state.message = error.message;
      })

      // get-productLocation-by-locationId
      .addCase(getProductLocationByLocationId.pending, (state) => {
        return {
          ...state,
          pending: true,
        };
      })
      .addCase(
        getProductLocationByLocationId.fulfilled,
        (state, { payload }) => {
          return {
            ...state,
            pending: false,
            error: false,
            productLocation: payload,
          };
        }
      )
      .addCase(getProductLocationByLocationId.rejected, (state, { error }) => {
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

const productLocationManagementReducers = productLocationSlice.reducer;

export const { resetProductLocation } = productLocationSlice.actions;
export const selectProductLocationManagement = (state: RootState) =>
  state.productLocationManagement;

export default productLocationManagementReducers;

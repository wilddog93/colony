import {
  Action,
  AnyAction,
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import type { RootState } from "../../../../store";

// here we are typing the types for the state
export type ProductBrandState = {
  productBrands: any;
  productBrand: any;
  pending: boolean;
  error: boolean;
  message: any;
};

const initialState: ProductBrandState = {
  productBrands: {},
  productBrand: {},
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

interface ProductBrandData {
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

// get all product brand
export const getProductBrands = createAsyncThunk<
  any,
  DefaultGetData,
  { state: RootState }
>("/productBrand", async (params, { getState }) => {
  let config: HeadersConfiguration = {
    params: params.params,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${params.token}`,
    },
  };
  try {
    const response = await axios.get("api/brand", config);
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
export const getProductBrandById = createAsyncThunk<
  any,
  DefaultGetData,
  { state: RootState }
>("/productBrand/id", async (params, { getState }) => {
  let config: HeadersConfiguration = {
    params: params.params,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${params.token}`,
    },
  };
  try {
    const response = await axios.get(`api/brand/${params.id}`, config);
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
export const createProductBrand = createAsyncThunk<
  any,
  ProductBrandData,
  { state: RootState }
>("/productBrand/create", async (params, { getState }) => {
  let config: HeadersConfiguration = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${params.token}`,
    },
  };
  try {
    const response = await axios.post("api/brand", params.data, config);
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
export const updateProductBrand = createAsyncThunk<
  any,
  ProductBrandData,
  { state: RootState }
>("/productBrand/update", async (params, { getState }) => {
  let config: HeadersConfiguration = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${params.token}`,
    },
  };
  try {
    const response = await axios.patch(
      `api/brand/${params.id}`,
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
export const deleteProductBrand = createAsyncThunk<
  any,
  ProductBrandData,
  { state: RootState }
>("/productBrand/delete", async (params, { getState }) => {
  let config: HeadersConfiguration = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${params.token}`,
    },
  };
  try {
    const response = await axios.delete(`api/brand/${params.id}`, config);
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
export const productBrandSlice = createSlice({
  name: "productBrands",
  initialState,
  reducers: {
    // leave this empty here
    resetProductBrand(state) {
      state.productBrand = {};
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
      // get-product-brands
      .addCase(getProductBrands.pending, (state) => {
        return {
          ...state,
          pending: true,
        };
      })
      .addCase(getProductBrands.fulfilled, (state, { payload }) => {
        return {
          ...state,
          pending: false,
          error: false,
          productBrands: payload,
        };
      })
      .addCase(getProductBrands.rejected, (state, { error }) => {
        state.pending = false;
        state.error = true;
        state.message = error.message;
      })

      // get-product-brand-id
      .addCase(getProductBrandById.pending, (state) => {
        return {
          ...state,
          pending: true,
        };
      })
      .addCase(getProductBrandById.fulfilled, (state, { payload }) => {
        return {
          ...state,
          pending: false,
          error: false,
          productBrand: payload,
        };
      })
      .addCase(getProductBrandById.rejected, (state, { error }) => {
        state.pending = false;
        state.error = true;
        state.message = error.message;
      })

      // create-product-brand
      .addCase(createProductBrand.pending, (state) => {
        return {
          ...state,
          pending: true,
        };
      })
      .addCase(createProductBrand.fulfilled, (state, { payload }) => {
        return {
          ...state,
          pending: false,
          error: false,
        };
      })
      .addCase(createProductBrand.rejected, (state, { error }) => {
        state.pending = false;
        state.error = true;
        state.message = error.message;
      })

      // update-product-brand
      .addCase(updateProductBrand.pending, (state) => {
        return {
          ...state,
          pending: true,
        };
      })
      .addCase(updateProductBrand.fulfilled, (state, { payload }) => {
        return {
          ...state,
          pending: false,
          error: false,
        };
      })
      .addCase(updateProductBrand.rejected, (state, { error }) => {
        state.pending = false;
        state.error = true;
        state.message = error.message;
      })

      // delete-product-unit
      .addCase(deleteProductBrand.pending, (state) => {
        return {
          ...state,
          pending: true,
        };
      })
      .addCase(deleteProductBrand.fulfilled, (state, { payload }) => {
        return {
          ...state,
          pending: false,
          error: false,
        };
      })
      .addCase(deleteProductBrand.rejected, (state, { error }) => {
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

const productBrandReducers = productBrandSlice.reducer;

export const { resetProductBrand } = productBrandSlice.actions;
export const selectProductBrandManagement = (state: RootState) =>
  state.productBrandManagement;

export default productBrandReducers;

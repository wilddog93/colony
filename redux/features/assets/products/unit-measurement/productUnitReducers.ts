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
export type ProductUnitState = {
  productUnits: any;
  productUnit: any;
  pending: boolean;
  error: boolean;
  message: any;
};

const initialState: ProductUnitState = {
  productUnits: {},
  productUnit: {},
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

interface productUnitData {
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

// get all product category
export const getProductUnits = createAsyncThunk<
  any,
  DefaultGetData,
  { state: RootState }
>("/productUnit", async (params, { getState }) => {
  let config: HeadersConfiguration = {
    params: params.params,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${params.token}`,
    },
  };
  try {
    const response = await axios.get("api/unitMeasurement", config);
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
export const getProductUnitById = createAsyncThunk<
  any,
  DefaultGetData,
  { state: RootState }
>("/productUnit/id", async (params, { getState }) => {
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
      `api/unitMeasurement/${params.id}`,
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

// create product type
export const createProductUnit = createAsyncThunk<
  any,
  productUnitData,
  { state: RootState }
>("/productUnit/create", async (params, { getState }) => {
  let config: HeadersConfiguration = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${params.token}`,
    },
  };
  try {
    const response = await axios.post(
      "api/unitMeasurement",
      params.data,
      config
    );
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
export const updateProductUnit = createAsyncThunk<
  any,
  productUnitData,
  { state: RootState }
>("/productUnit/update", async (params, { getState }) => {
  let config: HeadersConfiguration = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${params.token}`,
    },
  };
  try {
    const response = await axios.patch(
      `api/unitMeasurement/${params.id}`,
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
export const deleteProductUnit = createAsyncThunk<
  any,
  productUnitData,
  { state: RootState }
>("/productUnit/delete", async (params, { getState }) => {
  let config: HeadersConfiguration = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${params.token}`,
    },
  };
  try {
    const response = await axios.delete(
      `api/unitMeasurement/${params.id}`,
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
export const productUnitSlice = createSlice({
  name: "productUnits",
  initialState,
  reducers: {
    // leave this empty here
    resetProductUnit(state) {
      state.productUnit = {};
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
      // get-product-units
      .addCase(getProductUnits.pending, (state) => {
        return {
          ...state,
          pending: true,
        };
      })
      .addCase(getProductUnits.fulfilled, (state, { payload }) => {
        return {
          ...state,
          pending: false,
          error: false,
          productUnits: payload,
        };
      })
      .addCase(getProductUnits.rejected, (state, { error }) => {
        state.pending = false;
        state.error = true;
        state.message = error.message;
      })

      // get-product-unit-id
      .addCase(getProductUnitById.pending, (state) => {
        return {
          ...state,
          pending: true,
        };
      })
      .addCase(getProductUnitById.fulfilled, (state, { payload }) => {
        return {
          ...state,
          pending: false,
          error: false,
          productUnit: payload,
        };
      })
      .addCase(getProductUnitById.rejected, (state, { error }) => {
        state.pending = false;
        state.error = true;
        state.message = error.message;
      })

      // create-product-unit
      .addCase(createProductUnit.pending, (state) => {
        return {
          ...state,
          pending: true,
        };
      })
      .addCase(createProductUnit.fulfilled, (state, { payload }) => {
        return {
          ...state,
          pending: false,
          error: false,
        };
      })
      .addCase(createProductUnit.rejected, (state, { error }) => {
        state.pending = false;
        state.error = true;
        state.message = error.message;
      })

      // update-product-unit
      .addCase(updateProductUnit.pending, (state) => {
        return {
          ...state,
          pending: true,
        };
      })
      .addCase(updateProductUnit.fulfilled, (state, { payload }) => {
        return {
          ...state,
          pending: false,
          error: false,
        };
      })
      .addCase(updateProductUnit.rejected, (state, { error }) => {
        state.pending = false;
        state.error = true;
        state.message = error.message;
      })

      // delete-product-unit
      .addCase(deleteProductUnit.pending, (state) => {
        return {
          ...state,
          pending: true,
        };
      })
      .addCase(deleteProductUnit.fulfilled, (state, { payload }) => {
        return {
          ...state,
          pending: false,
          error: false,
        };
      })
      .addCase(deleteProductUnit.rejected, (state, { error }) => {
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

const productUnitReducers = productUnitSlice.reducer;

export const { resetProductUnit } = productUnitSlice.actions;
export const selectProductUnitManagement = (state: RootState) =>
  state.productUnitManagement;

export default productUnitReducers;

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
export type ParkingState = {
  parkingTransactions: any;
  parkingTransaction: any;
  pending: boolean;
  error: boolean;
  message: any;
};

const initialState: ParkingState = {
  parkingTransactions: {},
  parkingTransaction: {},
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

interface ParkingData {
  id?: any;
  params?: any;
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

// get all parkingTransaction
export const getParkingTransactions = createAsyncThunk<
  any,
  DefaultGetData,
  { state: RootState }
>("/parkingTransaction", async (params, { getState }) => {
  let config: HeadersConfiguration = {
    params: params.params,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${params.token}`,
    },
  };
  try {
    const response = await axios.get("api/parkingLot/transaction", config);
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

// get by ID parkingTransaction
export const getParkingTransactionById = createAsyncThunk<
  any,
  DefaultGetData,
  { state: RootState }
>("/parkingTransaction/id", async (params, { getState }) => {
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
      `api/parkingLot/transaction/${params.id}`,
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

// create parkingTransaction
export const createParkingTransaction = createAsyncThunk<
  any,
  ParkingData,
  { state: RootState }
>("/parkingTransaction/create", async (params, { getState }) => {
  let config: HeadersConfiguration = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${params.token}`,
    },
  };
  try {
    const response = await axios.post(
      "api/parkingLot/transaction",
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

export const updateParkingTransaction = createAsyncThunk<
  any,
  ParkingData,
  { state: RootState }
>("/parkingTransaction/update", async (params, { getState }) => {
  let config: HeadersConfiguration = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${params.token}`,
    },
  };
  try {
    const response = await axios.patch(
      `api/parkingLot/transaction/${params.id}`,
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

// uploud
export const uploadParkingTransaction = createAsyncThunk<
  any,
  ParkingData,
  { state: RootState }
>("/parkingTransaction/upload", async (params, { getState }) => {
  let config: HeadersConfiguration = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${params.token}`,
    },
  };
  try {
    const response = await axios.post(
      `api/parkingLot/transaction/upload`,
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

export const deleteParkingTransaction = createAsyncThunk<
  any,
  ParkingData,
  { state: RootState }
>("/parkingTransaction/delete", async (params, { getState }) => {
  let config: HeadersConfiguration = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${params.token}`,
    },
  };
  try {
    const response = await axios.delete(
      `api/parkingLot/transaction/${params.id}`,
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
export const parkingTransactionSlice = createSlice({
  name: "parkingTransactions",
  initialState,
  reducers: {
    // leave this empty here
    resetParkingTransaction(state) {
      state.parkingTransaction = {};
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
      // get-parkingTransactions
      .addCase(getParkingTransactions.pending, (state) => {
        return {
          ...state,
          pending: true,
        };
      })
      .addCase(getParkingTransactions.fulfilled, (state, { payload }) => {
        return {
          ...state,
          pending: false,
          error: false,
          parkingTransactions: payload,
        };
      })
      .addCase(getParkingTransactions.rejected, (state, { error }) => {
        state.pending = false;
        state.error = true;
        state.message = error.message;
      })

      .addCase(getParkingTransactionById.pending, (state) => {
        return {
          ...state,
          pending: true,
        };
      })
      .addCase(getParkingTransactionById.fulfilled, (state, { payload }) => {
        return {
          ...state,
          pending: false,
          error: false,
          parkingTransaction: payload,
        };
      })
      .addCase(getParkingTransactionById.rejected, (state, { error }) => {
        state.pending = false;
        state.error = true;
        state.message = error.message;
      })

      // create-parkingTransaction
      .addCase(createParkingTransaction.pending, (state) => {
        return {
          ...state,
          pending: true,
        };
      })
      .addCase(createParkingTransaction.fulfilled, (state, { payload }) => {
        return {
          ...state,
          pending: false,
          error: false,
        };
      })
      .addCase(createParkingTransaction.rejected, (state, { error }) => {
        state.pending = false;
        state.error = true;
        state.message = error.message;
      })

      // update-parkingTransaction
      .addCase(updateParkingTransaction.pending, (state) => {
        return {
          ...state,
          pending: true,
        };
      })
      .addCase(updateParkingTransaction.fulfilled, (state, { payload }) => {
        return {
          ...state,
          pending: false,
          error: false,
        };
      })
      .addCase(updateParkingTransaction.rejected, (state, { error }) => {
        state.pending = false;
        state.error = true;
        state.message = error.message;
      })

      // upload-parkingTransaction
      .addCase(uploadParkingTransaction.pending, (state) => {
        return {
          ...state,
          pending: true,
        };
      })
      .addCase(uploadParkingTransaction.fulfilled, (state, { payload }) => {
        return {
          ...state,
          pending: false,
          error: false,
        };
      })
      .addCase(uploadParkingTransaction.rejected, (state, { error }) => {
        state.pending = false;
        state.error = true;
        state.message = error.message;
      })

      // delete-parkingTransaction
      .addCase(deleteParkingTransaction.pending, (state) => {
        return {
          ...state,
          pending: true,
        };
      })
      .addCase(deleteParkingTransaction.fulfilled, (state, { payload }) => {
        return {
          ...state,
          pending: false,
          error: false,
        };
      })
      .addCase(deleteParkingTransaction.rejected, (state, { error }) => {
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

const parkingTransactionReducers = parkingTransactionSlice.reducer;

export const { resetParkingTransaction } = parkingTransactionSlice.actions;
export const selectParkingTransactionManagement = (state: RootState) =>
  state.parkingTransactionManagement;

export default parkingTransactionReducers;

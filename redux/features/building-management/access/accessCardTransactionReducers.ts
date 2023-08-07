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
export type AccessCardState = {
  accessCardTransactions: any;
  accessCardTransaction: any;
  pending: boolean;
  error: boolean;
  message: any;
};

const initialState: AccessCardState = {
  accessCardTransactions: {},
  accessCardTransaction: {},
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

interface AccessCardData {
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

// get all accessCardTransaction
export const getAccessCardTransactions = createAsyncThunk<
  any,
  DefaultGetData,
  { state: RootState }
>("/accessCardTransaction", async (params, { getState }) => {
  let config: HeadersConfiguration = {
    params: params.params,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${params.token}`,
    },
  };
  try {
    const response = await axios.get("accessCard/transaction", config);
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

// get by ID accessCardTransaction
export const getAccessCardTransactionById = createAsyncThunk<
  any,
  DefaultGetData,
  { state: RootState }
>("/accessCardTransaction/id", async (params, { getState }) => {
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
      `accessCard/transaction/${params.id}`,
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

// create accessCardTransaction
export const createAccessCardTransaction = createAsyncThunk<
  any,
  AccessCardData,
  { state: RootState }
>("/accessCardTransaction/create", async (params, { getState }) => {
  let config: HeadersConfiguration = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${params.token}`,
    },
  };
  try {
    const response = await axios.post(
      "accessCard/transaction",
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

export const updateAccessCardTransaction = createAsyncThunk<
  any,
  AccessCardData,
  { state: RootState }
>("/accessCardTransaction/update", async (params, { getState }) => {
  let config: HeadersConfiguration = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${params.token}`,
    },
  };
  try {
    const response = await axios.patch(
      `accessCard/transaction/${params.id}`,
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
export const uploadAccessCardTransaction = createAsyncThunk<
  any,
  AccessCardData,
  { state: RootState }
>("/accessCardTransaction/upload", async (params, { getState }) => {
  let config: HeadersConfiguration = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${params.token}`,
    },
  };
  try {
    const response = await axios.post(
      `accessCard/transaction/upload`,
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

export const deleteAccessCardTransaction = createAsyncThunk<
  any,
  AccessCardData,
  { state: RootState }
>("/accessCardTransaction/delete", async (params, { getState }) => {
  let config: HeadersConfiguration = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${params.token}`,
    },
  };
  try {
    const response = await axios.delete(
      `accessCard/transaction/${params.id}`,
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
export const accessCardTransactionSlice = createSlice({
  name: "accessCardTransactions",
  initialState,
  reducers: {
    // leave this empty here
    resetAccessCardTransaction(state) {
      state.accessCardTransaction = {};
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
      // get-accessCardTransactions
      .addCase(getAccessCardTransactions.pending, (state) => {
        return {
          ...state,
          pending: true,
        };
      })
      .addCase(getAccessCardTransactions.fulfilled, (state, { payload }) => {
        return {
          ...state,
          pending: false,
          error: false,
          accessCardTransactions: payload,
        };
      })
      .addCase(getAccessCardTransactions.rejected, (state, { error }) => {
        state.pending = false;
        state.error = true;
        state.message = error.message;
      })

      .addCase(getAccessCardTransactionById.pending, (state) => {
        return {
          ...state,
          pending: true,
        };
      })
      .addCase(getAccessCardTransactionById.fulfilled, (state, { payload }) => {
        return {
          ...state,
          pending: false,
          error: false,
          accessCardTransaction: payload,
        };
      })
      .addCase(getAccessCardTransactionById.rejected, (state, { error }) => {
        state.pending = false;
        state.error = true;
        state.message = error.message;
      })

      // create-accessCardTransaction
      .addCase(createAccessCardTransaction.pending, (state) => {
        return {
          ...state,
          pending: true,
        };
      })
      .addCase(createAccessCardTransaction.fulfilled, (state, { payload }) => {
        return {
          ...state,
          pending: false,
          error: false,
        };
      })
      .addCase(createAccessCardTransaction.rejected, (state, { error }) => {
        state.pending = false;
        state.error = true;
        state.message = error.message;
      })

      // update-accessCardTransaction
      .addCase(updateAccessCardTransaction.pending, (state) => {
        return {
          ...state,
          pending: true,
        };
      })
      .addCase(updateAccessCardTransaction.fulfilled, (state, { payload }) => {
        return {
          ...state,
          pending: false,
          error: false,
        };
      })
      .addCase(updateAccessCardTransaction.rejected, (state, { error }) => {
        state.pending = false;
        state.error = true;
        state.message = error.message;
      })

      // upload-accessCardTransaction
      .addCase(uploadAccessCardTransaction.pending, (state) => {
        return {
          ...state,
          pending: true,
        };
      })
      .addCase(uploadAccessCardTransaction.fulfilled, (state, { payload }) => {
        return {
          ...state,
          pending: false,
          error: false,
        };
      })
      .addCase(uploadAccessCardTransaction.rejected, (state, { error }) => {
        state.pending = false;
        state.error = true;
        state.message = error.message;
      })

      // delete-accessCardTransaction
      .addCase(deleteAccessCardTransaction.pending, (state) => {
        return {
          ...state,
          pending: true,
        };
      })
      .addCase(deleteAccessCardTransaction.fulfilled, (state, { payload }) => {
        return {
          ...state,
          pending: false,
          error: false,
        };
      })
      .addCase(deleteAccessCardTransaction.rejected, (state, { error }) => {
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

const accessCardTransactionReducers = accessCardTransactionSlice.reducer;

export const { resetAccessCardTransaction } =
  accessCardTransactionSlice.actions;
export const selectAccessCardTransactionManagement = (state: RootState) =>
  state.accessCardTransactionManagement;

export default accessCardTransactionReducers;

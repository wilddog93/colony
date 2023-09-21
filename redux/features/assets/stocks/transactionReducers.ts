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
export type TransactionState = {
  transactions: any;
  transaction: any;
  pending: boolean;
  error: boolean;
  message: any;
};

const initialState: TransactionState = {
  transactions: {},
  transaction: {},
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

interface TransactionData {
  id?: any;
  documentId?: any;
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

// get all transaction
export const getTransactions = createAsyncThunk<
  any,
  DefaultGetData,
  { state: RootState }
>("/transaction", async (params, { getState }) => {
  let config: HeadersConfiguration = {
    params: params.params,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${params.token}`,
    },
  };
  try {
    const response = await axios.get("transaction", config);
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
export const getTransactionById = createAsyncThunk<
  any,
  DefaultGetData,
  { state: RootState }
>("/transaction/id", async (params, { getState }) => {
  let config: HeadersConfiguration = {
    params: params.params,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${params.token}`,
    },
  };
  try {
    const response = await axios.get(`transaction/${params.id}`, config);
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

// create-order
export const createTransactionOrder = createAsyncThunk<
  any,
  TransactionData,
  { state: RootState }
>("/transaction/create/order", async (params, { getState }) => {
  let config: HeadersConfiguration = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${params.token}`,
    },
  };
  try {
    const response = await axios.post("transaction/order", params.data, config);
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

// create-move
export const createTransactionMove = createAsyncThunk<
  any,
  TransactionData,
  { state: RootState }
>("/transaction/create/move", async (params, { getState }) => {
  let config: HeadersConfiguration = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${params.token}`,
    },
  };
  try {
    const response = await axios.post("transaction/move", params.data, config);
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

// create-usage
export const createTransactionUsage = createAsyncThunk<
  any,
  TransactionData,
  { state: RootState }
>("/transaction/create/usage", async (params, { getState }) => {
  let config: HeadersConfiguration = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${params.token}`,
    },
  };
  try {
    const response = await axios.post("transaction/usage", params.data, config);
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

// create-out
export const createTransactionOut = createAsyncThunk<
  any,
  TransactionData,
  { state: RootState }
>("/transaction/create/out", async (params, { getState }) => {
  let config: HeadersConfiguration = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${params.token}`,
    },
  };
  try {
    const response = await axios.post("transaction/out", params.data, config);
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

// create-stock-balance
export const createTransactionStockBalance = createAsyncThunk<
  any,
  TransactionData,
  { state: RootState }
>("/transaction/create/stockBalance", async (params, { getState }) => {
  let config: HeadersConfiguration = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${params.token}`,
    },
  };
  try {
    const response = await axios.post(
      "transaction/stockBalance",
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

// create-document-by-id
export const createTransactionDocumentById = createAsyncThunk<
  any,
  TransactionData,
  { state: RootState }
>("/transaction/create/id/document", async (params, { getState }) => {
  let config: HeadersConfiguration = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${params.token}`,
    },
  };
  try {
    const response = await axios.post(
      `transaction/${params.id}/document`,
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
export const updateTransaction = createAsyncThunk<
  any,
  TransactionData,
  { state: RootState }
>("/transaction/update", async (params, { getState }) => {
  let config: HeadersConfiguration = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${params.token}`,
    },
  };
  try {
    const response = await axios.patch(
      `transaction/${params.id}`,
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

// update-change-status
export const updateTransactionChangeStatus = createAsyncThunk<
  any,
  TransactionData,
  { state: RootState }
>("/transaction/update/change-status", async (params, { getState }) => {
  let config: HeadersConfiguration = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${params.token}`,
    },
  };
  try {
    const response = await axios.patch(
      `transaction/switchStatus/${params.id}`,
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
export const deleteTransaction = createAsyncThunk<
  any,
  TransactionData,
  { state: RootState }
>("/transaction/delete", async (params, { getState }) => {
  let config: HeadersConfiguration = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${params.token}`,
    },
  };
  try {
    const response = await axios.delete(`transaction/${params.id}`, config);
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

// delete
export const deleteTransactionDocumentById = createAsyncThunk<
  any,
  TransactionData,
  { state: RootState }
>(
  "/transaction/delete/id/document/documentId",
  async (params, { getState }) => {
    let config: HeadersConfiguration = {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${params.token}`,
      },
    };
    try {
      const response = await axios.delete(
        `transaction/${params.id}/document/${params.documentId}`,
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
  }
);

// SLICER
export const transactionSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {
    // leave this empty here
    resetTransaction(state) {
      state.transaction = {};
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
      // get-transactions
      .addCase(getTransactions.pending, (state) => {
        return {
          ...state,
          pending: true,
        };
      })
      .addCase(getTransactions.fulfilled, (state, { payload }) => {
        return {
          ...state,
          pending: false,
          error: false,
          transactions: payload,
        };
      })
      .addCase(getTransactions.rejected, (state, { error }) => {
        state.pending = false;
        state.error = true;
        state.message = error.message;
      })

      // get-transaction-id
      .addCase(getTransactionById.pending, (state) => {
        return {
          ...state,
          pending: true,
        };
      })
      .addCase(getTransactionById.fulfilled, (state, { payload }) => {
        return {
          ...state,
          pending: false,
          error: false,
          transaction: payload,
        };
      })
      .addCase(getTransactionById.rejected, (state, { error }) => {
        state.pending = false;
        state.error = true;
        state.message = error.message;
      })

      // create-transaction-order
      .addCase(createTransactionOrder.pending, (state) => {
        return {
          ...state,
          pending: true,
        };
      })
      .addCase(createTransactionOrder.fulfilled, (state, { payload }) => {
        return {
          ...state,
          pending: false,
          error: false,
        };
      })
      .addCase(createTransactionOrder.rejected, (state, { error }) => {
        state.pending = false;
        state.error = true;
        state.message = error.message;
      })

      // create-transaction-move
      .addCase(createTransactionMove.pending, (state) => {
        return {
          ...state,
          pending: true,
        };
      })
      .addCase(createTransactionMove.fulfilled, (state, { payload }) => {
        return {
          ...state,
          pending: false,
          error: false,
        };
      })
      .addCase(createTransactionMove.rejected, (state, { error }) => {
        state.pending = false;
        state.error = true;
        state.message = error.message;
      })

      // create-transaction-usage
      .addCase(createTransactionUsage.pending, (state) => {
        return {
          ...state,
          pending: true,
        };
      })
      .addCase(createTransactionUsage.fulfilled, (state, { payload }) => {
        return {
          ...state,
          pending: false,
          error: false,
        };
      })
      .addCase(createTransactionUsage.rejected, (state, { error }) => {
        state.pending = false;
        state.error = true;
        state.message = error.message;
      })

      // create-transaction-out
      .addCase(createTransactionOut.pending, (state) => {
        return {
          ...state,
          pending: true,
        };
      })
      .addCase(createTransactionOut.fulfilled, (state, { payload }) => {
        return {
          ...state,
          pending: false,
          error: false,
        };
      })
      .addCase(createTransactionOut.rejected, (state, { error }) => {
        state.pending = false;
        state.error = true;
        state.message = error.message;
      })

      // create-transaction-stock-balance
      .addCase(createTransactionStockBalance.pending, (state) => {
        return {
          ...state,
          pending: true,
        };
      })
      .addCase(
        createTransactionStockBalance.fulfilled,
        (state, { payload }) => {
          return {
            ...state,
            pending: false,
            error: false,
          };
        }
      )
      .addCase(createTransactionStockBalance.rejected, (state, { error }) => {
        state.pending = false;
        state.error = true;
        state.message = error.message;
      })

      // create-transaction-document-by-id
      .addCase(createTransactionDocumentById.pending, (state) => {
        return {
          ...state,
          pending: true,
        };
      })
      .addCase(
        createTransactionDocumentById.fulfilled,
        (state, { payload }) => {
          return {
            ...state,
            pending: false,
            error: false,
          };
        }
      )
      .addCase(createTransactionDocumentById.rejected, (state, { error }) => {
        state.pending = false;
        state.error = true;
        state.message = error.message;
      })

      // update-transaction
      .addCase(updateTransaction.pending, (state) => {
        return {
          ...state,
          pending: true,
        };
      })
      .addCase(updateTransaction.fulfilled, (state, { payload }) => {
        return {
          ...state,
          pending: false,
          error: false,
        };
      })
      .addCase(updateTransaction.rejected, (state, { error }) => {
        state.pending = false;
        state.error = true;
        state.message = error.message;
      })

      // update-transaction-change-status
      .addCase(updateTransactionChangeStatus.pending, (state) => {
        return {
          ...state,
          pending: true,
        };
      })
      .addCase(
        updateTransactionChangeStatus.fulfilled,
        (state, { payload }) => {
          return {
            ...state,
            pending: false,
            error: false,
          };
        }
      )
      .addCase(updateTransactionChangeStatus.rejected, (state, { error }) => {
        state.pending = false;
        state.error = true;
        state.message = error.message;
      })

      // delete-transaction
      .addCase(deleteTransaction.pending, (state) => {
        return {
          ...state,
          pending: true,
        };
      })
      .addCase(deleteTransaction.fulfilled, (state, { payload }) => {
        return {
          ...state,
          pending: false,
          error: false,
        };
      })
      .addCase(deleteTransaction.rejected, (state, { error }) => {
        state.pending = false;
        state.error = true;
        state.message = error.message;
      })

      // delete-transaction-document-by-id
      .addCase(deleteTransactionDocumentById.pending, (state) => {
        return {
          ...state,
          pending: true,
        };
      })
      .addCase(
        deleteTransactionDocumentById.fulfilled,
        (state, { payload }) => {
          return {
            ...state,
            pending: false,
            error: false,
          };
        }
      )
      .addCase(deleteTransactionDocumentById.rejected, (state, { error }) => {
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

const transactionManagementReducers = transactionSlice.reducer;

export const { resetTransaction } = transactionSlice.actions;
export const selectTransactionManagement = (state: RootState) =>
  state.transactionManagement;

export default transactionManagementReducers;

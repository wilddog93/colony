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
export type DomainState = {
  domainAccessGroups: any;
  domainAccessGroup: any;
  pending: boolean;
  error: boolean;
  message: any;
};

const initialState: DomainState = {
  domainAccessGroups: {},
  domainAccessGroup: {},
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

interface DomainData {
  id?: any;
  data: any;
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

// get domain access group
export const getDomainAccessGroup = createAsyncThunk<
  any,
  DefaultGetData,
  { state: RootState }
>("/domainAccessGroup", async (params, { getState }) => {
  let config: HeadersConfiguration = {
    params: params.params,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${params.token}`,
    },
  };
  try {
    const response = await axios.get("api/domainAccessGroup", config);
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

export const createDomainAccessGroup = createAsyncThunk<
  any,
  DomainData,
  { state: RootState }
>("/post/domainAccessGroup", async (params, { getState }) => {
  let config: HeadersConfiguration = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${params.token}`,
    },
  };
  try {
    const response = await axios.post(
      "api/domainAccessGroup",
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
    params.isError();
    toast.dark(newError.message);
    if (error.response && error.response.status === 404) {
      throw new Error("User not found");
    } else {
      throw new Error(newError.message);
    }
  }
});

export const updateDomainAccessGroup = createAsyncThunk<
  any,
  DomainData,
  { state: RootState }
>("/update/domainAccessGroup", async (params, { getState }) => {
  let config: HeadersConfiguration = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${params.token}`,
    },
  };
  try {
    const response = await axios.patch(
      `api/domainAccessGroup/${params.id}`,
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
    params.isError();
    toast.dark(newError.message);
    if (error.response && error.response.status === 404) {
      throw new Error("User not found");
    } else {
      throw new Error(newError.message);
    }
  }
});

export const deleteDomainAccessGroups = createAsyncThunk<
  any,
  DomainData,
  { state: RootState }
>("/delete/domainAccessGroups/", async (params, { getState }) => {
  let config: HeadersConfiguration = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${params.token}`,
    },
  };
  try {
    const response = await axios.delete(`api/domainAccessGroup`, {
      data: params.data,
      headers: config.headers,
    });
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
    params.isError();
    toast.dark(newError.message);
    if (error.response && error.response.status === 404) {
      throw new Error("User not found");
    } else {
      throw new Error(newError.message);
    }
  }
});

// SLICER
export const domainAccessGroupSlice = createSlice({
  name: "domainAccessGroup",
  initialState,
  reducers: {
    // leave this empty here
    resetDomainAccessGroup(state) {
      state.domainAccessGroup = {};
      state.pending = false;
      state.error = false;
      state.message = "";
    },
  },
  // The `extraReducers` field lets the slice handle actions defined elsewhere, including actions generated by createAsyncThunk or in other slices.
  // Since this is an API call we have 3 possible outcomes: pending, fulfilled and rejected. We have made allocations for all 3 outcomes.
  // Doing this is good practice as we can tap into the status of the API call and give our users an idea of what's happening in the background.
  // create-domain-access-group

  extraReducers: (builder) => {
    builder
      // get-domain-access-group
      .addCase(getDomainAccessGroup.pending, (state) => {
        return {
          ...state,
          pending: true,
        };
      })
      .addCase(getDomainAccessGroup.fulfilled, (state, { payload }) => {
        return {
          ...state,
          pending: false,
          error: false,
          domainAccessGroups: payload,
        };
      })
      .addCase(getDomainAccessGroup.rejected, (state, { error }) => {
        state.pending = false;
        state.error = true;
        state.message = error.message;
      })

      // create domain access
      .addCase(createDomainAccessGroup.pending, (state) => {
        return {
          ...state,
          pending: true,
        };
      })
      .addCase(createDomainAccessGroup.fulfilled, (state, { payload }) => {
        return {
          ...state,
          pending: false,
          error: false,
        };
      })
      .addCase(createDomainAccessGroup.rejected, (state, { error }) => {
        state.pending = false;
        state.error = true;
        state.message = error.message;
      })

      // update
      .addCase(updateDomainAccessGroup.pending, (state) => {
        return {
          ...state,
          pending: true,
        };
      })
      .addCase(updateDomainAccessGroup.fulfilled, (state, { payload }) => {
        return {
          ...state,
          pending: false,
          error: false,
        };
      })
      .addCase(updateDomainAccessGroup.rejected, (state, { error }) => {
        state.pending = false;
        state.error = true;
        state.message = error.message;
      })

      // delete by arr id
      .addCase(deleteDomainAccessGroups.pending, (state) => {
        return {
          ...state,
          pending: true,
        };
      })
      .addCase(deleteDomainAccessGroups.fulfilled, (state, { payload }) => {
        return {
          ...state,
          pending: false,
          error: false,
        };
      })
      .addCase(deleteDomainAccessGroups.rejected, (state, { error }) => {
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

const domainAccessGroupReducers = domainAccessGroupSlice.reducer;

export const { resetDomainAccessGroup } = domainAccessGroupSlice.actions;
export const selectDomainAccessGroup = (state: RootState) =>
  state.domainAccessGroup;

export default domainAccessGroupReducers;

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
export type UserState = {
  userProperties: any;
  userProperty: any;
  userTenants: any;
  userTenant: any;
  pending: boolean;
  error: boolean;
  message: any;
};

const initialState: UserState = {
  userProperties: {},
  userProperty: {},
  userTenants: {},
  userTenant: {},
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

interface UserData {
  id?: any;
  data: any;
  token?: any;
  isSuccess: () => void;
}

interface DefaultGetData {
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

// get all user property
export const getUsersProperty = createAsyncThunk<
  any,
  DefaultGetData,
  { state: RootState }
>("api/user/property", async (params, { getState }) => {
  let config: HeadersConfiguration = {
    params: params.params,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${params.token}`,
    },
  };
  try {
    const response = await axios.get("api/user/property", config);
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

// get all user-tenant-property
export const getUsersTenantProperty = createAsyncThunk<
  any,
  DefaultGetData,
  { state: RootState }
>("api/user/tenant/property", async (params, { getState }) => {
  let config: HeadersConfiguration = {
    params: params.params,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${params.token}`,
    },
  };
  try {
    const response = await axios.get("api/user/tenant/property", config);
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

export const inviteUsersProperty = createAsyncThunk<
  any,
  UserData,
  { state: RootState }
>("api/user/property/invite", async (params, { getState }) => {
  let config: HeadersConfiguration = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${params.token}`,
    },
  };
  try {
    const response = await axios.post(
      "api/user/property/invite",
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

export const registerUsersProperty = createAsyncThunk<
  any,
  UserData,
  { state: RootState }
>("api/user/property/invite/register", async (params, { getState }) => {
  let config: HeadersConfiguration = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${params.token}`,
    },
  };
  try {
    const response = await axios.post(
      "api/user/property/invite/register",
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

export const usersPropertyAddTenant = createAsyncThunk<
  any,
  UserData,
  { state: RootState }
>("api/user/property/addTenant", async (params, { getState }) => {
  let config: HeadersConfiguration = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${params.token}`,
    },
  };
  try {
    const response = await axios.post(
      "api/user/addTenant",
      params?.data,
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

// remove tenant/owner
export const usersPropertyDeleteTenant = createAsyncThunk<
  any,
  UserData,
  { state: RootState }
>("api/user/property/removeTenant", async (params, { getState }) => {
  let config: HeadersConfiguration = {
    data: params?.data,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${params.token}`,
    },
  };
  try {
    const response = await axios.delete("api/user/removeTenant", config);
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

export const usersPropertyAddOccupant = createAsyncThunk<
  any,
  UserData,
  { state: RootState }
>("api/user/property/addOccupant", async (params, { getState }) => {
  let config: HeadersConfiguration = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${params.token}`,
    },
  };
  try {
    const response = await axios.post(
      "api/user/addOccupant",
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

// remove occupant/user
export const usersPropertyDeleteOccupant = createAsyncThunk<
  any,
  UserData,
  { state: RootState }
>("api/user/property/removeOccupant", async (params, { getState }) => {
  let config: HeadersConfiguration = {
    data: params?.data,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${params.token}`,
    },
  };
  try {
    const response = await axios.delete("api/user/removeOccupant", config);
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
export const userPropertySlice = createSlice({
  name: "user-property",
  initialState,
  reducers: {
    // leave this empty here
    resetUserProperty(state) {
      state.userProperty = {};
      state.pending = false;
      state.error = false;
      state.message = "";
    },
    resetUserTenantProperty(state) {
      state.userTenant = {};
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
      // get-all user-property
      .addCase(getUsersProperty.pending, (state) => {
        return {
          ...state,
          pending: true,
        };
      })
      .addCase(getUsersProperty.fulfilled, (state, { payload }) => {
        return {
          ...state,
          pending: false,
          error: false,
          userProperties: payload,
        };
      })
      .addCase(getUsersProperty.rejected, (state, { error }) => {
        state.pending = false;
        state.error = true;
        state.message = error.message;
      })

      // get user-tenant-property
      .addCase(getUsersTenantProperty.pending, (state) => {
        return {
          ...state,
          pending: true,
        };
      })
      .addCase(getUsersTenantProperty.fulfilled, (state, { payload }) => {
        return {
          ...state,
          pending: false,
          error: false,
          userTenants: payload,
        };
      })
      .addCase(getUsersTenantProperty.rejected, (state, { error }) => {
        state.pending = false;
        state.error = true;
        state.message = error.message;
      })

      // invite-user-property
      .addCase(inviteUsersProperty.pending, (state) => {
        return {
          ...state,
          pending: true,
        };
      })
      .addCase(inviteUsersProperty.fulfilled, (state, { payload }) => {
        return {
          ...state,
          pending: false,
          error: false,
        };
      })
      .addCase(inviteUsersProperty.rejected, (state, { error }) => {
        state.pending = false;
        state.error = true;
        state.message = error.message;
      })

      // register-user-property
      .addCase(registerUsersProperty.pending, (state) => {
        return {
          ...state,
          pending: true,
        };
      })
      .addCase(registerUsersProperty.fulfilled, (state, { payload }) => {
        return {
          ...state,
          pending: false,
          error: false,
        };
      })
      .addCase(registerUsersProperty.rejected, (state, { error }) => {
        state.pending = false;
        state.error = true;
        state.message = error.message;
      })

      // add-tenant
      .addCase(usersPropertyAddTenant.pending, (state) => {
        return {
          ...state,
          pending: true,
        };
      })
      .addCase(usersPropertyAddTenant.fulfilled, (state, { payload }) => {
        return {
          ...state,
          pending: false,
          error: false,
        };
      })
      .addCase(usersPropertyAddTenant.rejected, (state, { error }) => {
        state.pending = false;
        state.error = true;
        state.message = error.message;
      })

      // add-occupant
      .addCase(usersPropertyAddOccupant.pending, (state) => {
        return {
          ...state,
          pending: true,
        };
      })
      .addCase(usersPropertyAddOccupant.fulfilled, (state, { payload }) => {
        return {
          ...state,
          pending: false,
          error: false,
        };
      })
      .addCase(usersPropertyAddOccupant.rejected, (state, { error }) => {
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

const userPropertyReducers = userPropertySlice.reducer;

export const { resetUserProperty, resetUserTenantProperty } =
  userPropertySlice.actions;
export const selectUserPropertyManagement = (state: RootState) =>
  state.userPropertyManagement;

export default userPropertyReducers;

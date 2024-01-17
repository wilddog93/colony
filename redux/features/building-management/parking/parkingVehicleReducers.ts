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
  parkingVehicles: any;
  parkingVehicle: any;
  pending: boolean;
  error: boolean;
  message: any;
};

const initialState: ParkingState = {
  parkingVehicles: {},
  parkingVehicle: {},
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

// get all parkingVehicle
export const getParkingVehicles = createAsyncThunk<
  any,
  DefaultGetData,
  { state: RootState }
>("/parkingVehicle", async (params, { getState }) => {
  let config: HeadersConfiguration = {
    params: params.params,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${params.token}`,
    },
  };
  try {
    const response = await axios.get("api/parkingLot/registered", config);
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

// get by ID parkingVehicle
export const getParkingVehicleById = createAsyncThunk<
  any,
  DefaultGetData,
  { state: RootState }
>("/parkingVehicle/id", async (params, { getState }) => {
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
      `api/parkingLot/registered/${params.id}`,
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

// create parkingVehicle
export const createParkingVehicle = createAsyncThunk<
  any,
  ParkingData,
  { state: RootState }
>("/parkingVehicle/create", async (params, { getState }) => {
  let config: HeadersConfiguration = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${params.token}`,
    },
  };
  try {
    const response = await axios.post(
      "api/parkingLot/registered",
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

export const updateParkingVehicle = createAsyncThunk<
  any,
  ParkingData,
  { state: RootState }
>("/parkingVehicle/update", async (params, { getState }) => {
  let config: HeadersConfiguration = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${params.token}`,
    },
  };
  try {
    const response = await axios.patch(
      `api/parkingLot/registered/${params.id}`,
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
export const uploadParkingVehicle = createAsyncThunk<
  any,
  ParkingData,
  { state: RootState }
>("/parkingVehicle/upload", async (params, { getState }) => {
  let config: HeadersConfiguration = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${params.token}`,
    },
  };
  try {
    const response = await axios.post(
      `api/parkingLot/registered/upload`,
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

export const deleteParkingVehicle = createAsyncThunk<
  any,
  ParkingData,
  { state: RootState }
>("/parkingVehicle/delete", async (params, { getState }) => {
  let config: HeadersConfiguration = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${params.token}`,
    },
  };
  try {
    const response = await axios.delete(
      `api/parkingLot/registered/${params.id}`,
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
export const parkingVehicleSlice = createSlice({
  name: "parkingVehicles",
  initialState,
  reducers: {
    // leave this empty here
    resetParkingVehicle(state) {
      state.parkingVehicle = {};
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
      // get-parkingVehicles
      .addCase(getParkingVehicles.pending, (state) => {
        return {
          ...state,
          pending: true,
        };
      })
      .addCase(getParkingVehicles.fulfilled, (state, { payload }) => {
        return {
          ...state,
          pending: false,
          error: false,
          parkingVehicles: payload,
        };
      })
      .addCase(getParkingVehicles.rejected, (state, { error }) => {
        state.pending = false;
        state.error = true;
        state.message = error.message;
      })

      .addCase(getParkingVehicleById.pending, (state) => {
        return {
          ...state,
          pending: true,
        };
      })
      .addCase(getParkingVehicleById.fulfilled, (state, { payload }) => {
        return {
          ...state,
          pending: false,
          error: false,
          parkingVehicle: payload,
        };
      })
      .addCase(getParkingVehicleById.rejected, (state, { error }) => {
        state.pending = false;
        state.error = true;
        state.message = error.message;
      })

      // create-parkingVehicle
      .addCase(createParkingVehicle.pending, (state) => {
        return {
          ...state,
          pending: true,
        };
      })
      .addCase(createParkingVehicle.fulfilled, (state, { payload }) => {
        return {
          ...state,
          pending: false,
          error: false,
        };
      })
      .addCase(createParkingVehicle.rejected, (state, { error }) => {
        state.pending = false;
        state.error = true;
        state.message = error.message;
      })

      // update-parkingVehicle
      .addCase(updateParkingVehicle.pending, (state) => {
        return {
          ...state,
          pending: true,
        };
      })
      .addCase(updateParkingVehicle.fulfilled, (state, { payload }) => {
        return {
          ...state,
          pending: false,
          error: false,
        };
      })
      .addCase(updateParkingVehicle.rejected, (state, { error }) => {
        state.pending = false;
        state.error = true;
        state.message = error.message;
      })

      // upload-parkingVehicle
      .addCase(uploadParkingVehicle.pending, (state) => {
        return {
          ...state,
          pending: true,
        };
      })
      .addCase(uploadParkingVehicle.fulfilled, (state, { payload }) => {
        return {
          ...state,
          pending: false,
          error: false,
        };
      })
      .addCase(uploadParkingVehicle.rejected, (state, { error }) => {
        state.pending = false;
        state.error = true;
        state.message = error.message;
      })

      // delete-parkingVehicle
      .addCase(deleteParkingVehicle.pending, (state) => {
        return {
          ...state,
          pending: true,
        };
      })
      .addCase(deleteParkingVehicle.fulfilled, (state, { payload }) => {
        return {
          ...state,
          pending: false,
          error: false,
        };
      })
      .addCase(deleteParkingVehicle.rejected, (state, { error }) => {
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

const parkingVehicleReducers = parkingVehicleSlice.reducer;

export const { resetParkingVehicle } = parkingVehicleSlice.actions;
export const selectParkingVehicleManagement = (state: RootState) =>
  state.parkingVehicleManagement;

export default parkingVehicleReducers;

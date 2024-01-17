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
export type TaskState = {
  tasks: any;
  task: any;
  pending: boolean;
  error: boolean;
  message: any;
};

const initialState: TaskState = {
  tasks: {},
  task: {},
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

interface TaskData {
  id?: any;
  taskId?: any;
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

// get all project
export const getTasksByIdProject = createAsyncThunk<
  any,
  DefaultGetData,
  { state: RootState }
>("/project/projectId/task", async (params, { getState }) => {
  let config: HeadersConfiguration = {
    params: params.params,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${params.token}`,
    },
  };
  try {
    const response = await axios.get(`api/project/${params.id}/task`, config);
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

// create issue
export const createTasks = createAsyncThunk<
  any,
  TaskData,
  { state: RootState }
>("/project/projectId/task/create", async (params, { getState }) => {
  let config: HeadersConfiguration = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${params.token}`,
    },
  };
  try {
    const response = await axios.post(
      `api/project/${params.id}/task`,
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

export const updateTasks = createAsyncThunk<
  any,
  TaskData,
  { state: RootState }
>("/project/projectId/taskId/update", async (params, { getState }) => {
  let config: HeadersConfiguration = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${params.token}`,
    },
  };
  try {
    const response = await axios.patch(
      `api/project/${params.id}/${params?.taskId}`,
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

// update-task-status
export const updateTaskStatus = createAsyncThunk<
  any,
  TaskData,
  { state: RootState }
>("/project/projectId/taskId/status/update", async (params, { getState }) => {
  let config: HeadersConfiguration = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${params.token}`,
    },
  };
  try {
    const response = await axios.patch(
      `api/project/${params.id}/${params.taskId}/status`,
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

// update-task-assignee
export const updateTaskAssignee = createAsyncThunk<
  any,
  TaskData,
  { state: RootState }
>("/project/projectId/taskId/assignee/update", async (params, { getState }) => {
  let config: HeadersConfiguration = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${params.token}`,
    },
  };
  try {
    const response = await axios.put(
      `api/project/${params.id}/${params.taskId}/assignee`,
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

export const deleteTasks = createAsyncThunk<
  any,
  TaskData,
  { state: RootState }
>("/project/projectId/taskId/delete", async (params, { getState }) => {
  let config: HeadersConfiguration = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${params.token}`,
    },
  };
  try {
    const response = await axios.delete(
      `api/project/${params.id}/${params?.taskId}`,
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
export const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    // leave this empty here
    resetTask(state) {
      state.task = {};
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
      // get-tasks
      .addCase(getTasksByIdProject.pending, (state) => {
        return {
          ...state,
          pending: true,
        };
      })
      .addCase(getTasksByIdProject.fulfilled, (state, { payload }) => {
        return {
          ...state,
          pending: false,
          error: false,
          tasks: payload,
        };
      })
      .addCase(getTasksByIdProject.rejected, (state, { error }) => {
        state.pending = false;
        state.error = true;
        state.message = error.message;
      })

      // create-task
      .addCase(createTasks.pending, (state) => {
        return {
          ...state,
          pending: true,
        };
      })
      .addCase(createTasks.fulfilled, (state, { payload }) => {
        return {
          ...state,
          pending: false,
          error: false,
        };
      })
      .addCase(createTasks.rejected, (state, { error }) => {
        state.pending = false;
        state.error = true;
        state.message = error.message;
      })

      // update-task
      .addCase(updateTasks.pending, (state) => {
        return {
          ...state,
          pending: true,
        };
      })
      .addCase(updateTasks.fulfilled, (state, { payload }) => {
        return {
          ...state,
          pending: false,
          error: false,
        };
      })
      .addCase(updateTasks.rejected, (state, { error }) => {
        state.pending = false;
        state.error = true;
        state.message = error.message;
      })

      // update-task-status
      .addCase(updateTaskStatus.pending, (state) => {
        return {
          ...state,
          pending: true,
        };
      })
      .addCase(updateTaskStatus.fulfilled, (state, { payload }) => {
        return {
          ...state,
          pending: false,
          error: false,
        };
      })
      .addCase(updateTaskStatus.rejected, (state, { error }) => {
        state.pending = false;
        state.error = true;
        state.message = error.message;
      })

      // update-task-assignee
      .addCase(updateTaskAssignee.pending, (state) => {
        return {
          ...state,
          pending: true,
        };
      })
      .addCase(updateTaskAssignee.fulfilled, (state, { payload }) => {
        return {
          ...state,
          pending: false,
          error: false,
        };
      })
      .addCase(updateTaskAssignee.rejected, (state, { error }) => {
        state.pending = false;
        state.error = true;
        state.message = error.message;
      })

      // delete-task
      .addCase(deleteTasks.pending, (state) => {
        return {
          ...state,
          pending: true,
        };
      })
      .addCase(deleteTasks.fulfilled, (state, { payload }) => {
        return {
          ...state,
          pending: false,
          error: false,
        };
      })
      .addCase(deleteTasks.rejected, (state, { error }) => {
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

const taskManagementReducers = taskSlice.reducer;

export const { resetTask } = taskSlice.actions;
export const selectTaskManagement = (state: RootState) => state.taskManagement;

export default taskManagementReducers;

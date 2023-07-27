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
export type TaskTodoState = {
  taskTodos: any;
  taskTodo: any;
  pending: boolean;
  error: boolean;
  message: any;
};

const initialState: TaskTodoState = {
  taskTodos: {},
  taskTodo: {},
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

interface TaskTodoData {
  id?: any;
  taskId?: any;
  subTaskId?: any;
  data?: any;
  token?: any;
  isSuccess: () => void;
  isError: () => void;
}

interface DefaultGetData {
  id?: any;
  taskId?: any;
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

// get all todos
export const getTaskTodos = createAsyncThunk<
  any,
  DefaultGetData,
  { state: RootState }
>("project/todos/get", async (params, { getState }) => {
  let config: HeadersConfiguration = {
    params: params?.params,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${params.token}`,
    },
  };
  try {
    const response = await axios.get(
      `project/${params?.id}/${params?.taskId}/subTask`,
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

// create todo
export const createTaskTodo = createAsyncThunk<
  any,
  TaskTodoData,
  { state: RootState }
>("/project/projectId/taskId/todo/create", async (params, { getState }) => {
  let config: HeadersConfiguration = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${params.token}`,
    },
  };
  try {
    const response = await axios.post(
      `project/${params.id}/${params.taskId}/subTask`,
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

// update todo
export const updateTaskTodo = createAsyncThunk<
  any,
  TaskTodoData,
  { state: RootState }
>(
  "/project/projectId/taskId/todo/todoId/update",
  async (params, { getState }) => {
    let config: HeadersConfiguration = {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${params.token}`,
      },
    };
    try {
      const response = await axios.patch(
        `project/${params.id}/${params?.taskId}/subTask/${params.subTaskId}`,
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
  }
);

export const deleteTaskTodo = createAsyncThunk<
  any,
  TaskTodoData,
  { state: RootState }
>(
  "/project/projectId/taskId/todo/todoId/delete",
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
        `/project/${params.id}/${params.taskId}/subTask/${params.subTaskId}`,
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
      params.isError();
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
export const taskTodoSlice = createSlice({
  name: "taskComments",
  initialState,
  reducers: {
    // leave this empty here
    resetTaskTodo(state) {
      state.taskTodo = {};
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
      .addCase(getTaskTodos.pending, (state) => {
        return {
          ...state,
          pending: true,
        };
      })
      .addCase(getTaskTodos.fulfilled, (state, { payload }) => {
        return {
          ...state,
          pending: false,
          error: false,
          taskTodos: payload,
        };
      })
      .addCase(getTaskTodos.rejected, (state, { error }) => {
        state.pending = false;
        state.error = true;
        state.message = error.message;
      })

      // create-task
      .addCase(createTaskTodo.pending, (state) => {
        return {
          ...state,
          pending: true,
        };
      })
      .addCase(createTaskTodo.fulfilled, (state, { payload }) => {
        return {
          ...state,
          pending: false,
          error: false,
        };
      })
      .addCase(createTaskTodo.rejected, (state, { error }) => {
        state.pending = false;
        state.error = true;
        state.message = error.message;
      })

      // update-task
      .addCase(updateTaskTodo.pending, (state) => {
        return {
          ...state,
          pending: true,
        };
      })
      .addCase(updateTaskTodo.fulfilled, (state, { payload }) => {
        return {
          ...state,
          pending: false,
          error: false,
        };
      })
      .addCase(updateTaskTodo.rejected, (state, { error }) => {
        state.pending = false;
        state.error = true;
        state.message = error.message;
      })

      // delete-task
      .addCase(deleteTaskTodo.pending, (state) => {
        return {
          ...state,
          pending: true,
        };
      })
      .addCase(deleteTaskTodo.fulfilled, (state, { payload }) => {
        return {
          ...state,
          pending: false,
          error: false,
        };
      })
      .addCase(deleteTaskTodo.rejected, (state, { error }) => {
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

const taskTodoReducers = taskTodoSlice.reducer;

export const { resetTaskTodo } = taskTodoSlice.actions;
export const selectTaskTodos = (state: RootState) => state.taskTodos;

export default taskTodoReducers;

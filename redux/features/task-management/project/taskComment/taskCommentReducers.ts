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
export type TaskCommentState = {
  taskComments: any;
  taskComment: any;
  pending: boolean;
  error: boolean;
  message: any;
};

const initialState: TaskCommentState = {
  taskComments: {},
  taskComment: {},
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

interface TaskCommentData {
  id?: any;
  taskId?: any;
  commentId?: any;
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

// get all project
export const getTaskComment = createAsyncThunk<
  any,
  DefaultGetData,
  { state: RootState }
>("project/comment/get", async (params, { getState }) => {
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
      `api/project/${params?.id}/${params?.taskId}/comment`,
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

// create issue
export const createTaskComment = createAsyncThunk<
  any,
  TaskCommentData,
  { state: RootState }
>("/project/projectId/taskId/comment/create", async (params, { getState }) => {
  let config: HeadersConfiguration = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${params.token}`,
    },
  };
  try {
    const response = await axios.post(
      `api/project/${params.id}/${params.taskId}/comment`,
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

export const updateTaskComment = createAsyncThunk<
  any,
  TaskCommentData,
  { state: RootState }
>(
  "/project/projectId/taskId/comment/commentId/update",
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
        `api/project/${params.id}/${params?.taskId}/comment/${params.commentId}`,
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

export const deleteTaskComment = createAsyncThunk<
  any,
  TaskCommentData,
  { state: RootState }
>(
  "/project/projectId/taskId/comment/commentId/delete",
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
        `/project/${params.id}/${params.taskId}/comment/${params.commentId}`,
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
export const taskCommentSlice = createSlice({
  name: "taskComments",
  initialState,
  reducers: {
    // leave this empty here
    resetTaskComment(state) {
      state.taskComment = {};
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
      .addCase(getTaskComment.pending, (state) => {
        return {
          ...state,
          pending: true,
        };
      })
      .addCase(getTaskComment.fulfilled, (state, { payload }) => {
        return {
          ...state,
          pending: false,
          error: false,
          taskComments: payload,
        };
      })
      .addCase(getTaskComment.rejected, (state, { error }) => {
        state.pending = false;
        state.error = true;
        state.message = error.message;
      })

      // create-task
      .addCase(createTaskComment.pending, (state) => {
        return {
          ...state,
          pending: true,
        };
      })
      .addCase(createTaskComment.fulfilled, (state, { payload }) => {
        return {
          ...state,
          pending: false,
          error: false,
        };
      })
      .addCase(createTaskComment.rejected, (state, { error }) => {
        state.pending = false;
        state.error = true;
        state.message = error.message;
      })

      // update-task
      .addCase(updateTaskComment.pending, (state) => {
        return {
          ...state,
          pending: true,
        };
      })
      .addCase(updateTaskComment.fulfilled, (state, { payload }) => {
        return {
          ...state,
          pending: false,
          error: false,
        };
      })
      .addCase(updateTaskComment.rejected, (state, { error }) => {
        state.pending = false;
        state.error = true;
        state.message = error.message;
      })

      // delete-task
      .addCase(deleteTaskComment.pending, (state) => {
        return {
          ...state,
          pending: true,
        };
      })
      .addCase(deleteTaskComment.fulfilled, (state, { payload }) => {
        return {
          ...state,
          pending: false,
          error: false,
        };
      })
      .addCase(deleteTaskComment.rejected, (state, { error }) => {
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

const taskCommentReducers = taskCommentSlice.reducer;

export const { resetTaskComment } = taskCommentSlice.actions;
export const selectTaskComment = (state: RootState) => state.taskComment;

export default taskCommentReducers;

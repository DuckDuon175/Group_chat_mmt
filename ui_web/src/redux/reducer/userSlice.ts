import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserRequest, UserResponse } from "../../api/api-generated";
import { ApiLoadingStatus } from "../../utils/loadingStatus";
import { createAsyncThunkWrap, IExceptionModel } from "../handler";
import { Service } from "../../api";

interface IUserState {
  data: UserResponse[];
  user: UserResponse;
  loadDataStatus: ApiLoadingStatus;
  loadDoctorDataStatus: ApiLoadingStatus;
  loadGetUserByIdStatus: ApiLoadingStatus;
  loadUpdateDataStatus: ApiLoadingStatus;
  loadDeleteDataStatus: ApiLoadingStatus;
  errorMessage: string | undefined;
}

const initialState: IUserState = {
  data: [],
  user: {} as UserResponse,
  loadDataStatus: ApiLoadingStatus.None,
  loadDoctorDataStatus: ApiLoadingStatus.None,
  loadGetUserByIdStatus: ApiLoadingStatus.None,
  loadUpdateDataStatus: ApiLoadingStatus.None,
  loadDeleteDataStatus: ApiLoadingStatus.None,
  errorMessage: undefined,
};

export const getAllUsers = createAsyncThunkWrap("/users", async () => {
  return await Service.userService.getAllUsers();
});

export const getUserById = createAsyncThunkWrap(
  "/user/id",
  async (id: string) => {
    return await Service.userService.getUserById(id);
  }
);

export const updateUserById = createAsyncThunkWrap(
  "/users/update",
  async (user: UserRequest) => {
    return await Service.userService.updateUserById(user);
  }
);

export const deleteUserById = createAsyncThunkWrap(
  "/users/delete",
  async (id: string) => {
    return await Service.userService.deleteUserById(id);
  }
);

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    resetLoadDataStatus: (state) => {
      state.loadDataStatus = ApiLoadingStatus.None;
    },
    resetLoadGetUserByIdStatus: (state) => {
      state.loadGetUserByIdStatus = ApiLoadingStatus.None;
    },
    resetLoadUpdateDataStatus: (state) => {
      state.loadUpdateDataStatus = ApiLoadingStatus.None;
    },
    resetLoadDeleteDataStatus: (state) => {
      state.loadDeleteDataStatus = ApiLoadingStatus.None;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllUsers.pending, (state, action) => {
        state.loadDataStatus = ApiLoadingStatus.Loading;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loadDataStatus = ApiLoadingStatus.Success;
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.data = [];
        state.errorMessage = (<any>action.payload)?.message;
        state.loadDataStatus = ApiLoadingStatus.Failed;
      })
      .addCase(updateUserById.pending, (state, action) => {
        state.loadUpdateDataStatus = ApiLoadingStatus.Loading;
      })
      .addCase(updateUserById.fulfilled, (state, action) => {
        state.loadUpdateDataStatus = ApiLoadingStatus.Success;
      })
      .addCase(updateUserById.rejected, (state, action) => {
        state.errorMessage = (<any>action.payload)?.message;
        state.loadUpdateDataStatus = ApiLoadingStatus.Failed;
      })
      .addCase(deleteUserById.pending, (state, action) => {
        state.loadDeleteDataStatus = ApiLoadingStatus.Loading;
      })
      .addCase(deleteUserById.fulfilled, (state, action) => {
        state.loadDeleteDataStatus = ApiLoadingStatus.Success;
      })
      .addCase(deleteUserById.rejected, (state, action) => {
        state.errorMessage = (<any>action.payload)?.message;
        state.loadDeleteDataStatus = ApiLoadingStatus.Failed;
      });
  },
});

export const {
  resetLoadDataStatus,
  resetLoadGetUserByIdStatus,
  resetLoadUpdateDataStatus,
  resetLoadDeleteDataStatus,
} = userSlice.actions;
export default userSlice.reducer;

import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ApiLoadingStatus } from "../../utils/loadingStatus";
import { createAsyncThunkWrap } from "../handler";
import {
  MessageSchema,
  MessageRequest,
  Service,
  GroupChatRequest,
} from "../../api";

interface IGroupChatState {
  loadCreateGroupChat: ApiLoadingStatus;
}

const initialState: IGroupChatState = {
  loadCreateGroupChat: ApiLoadingStatus.None,
};

export const createGroupChat = createAsyncThunkWrap(
  "/groupChat",
  async (groupChatRequest: GroupChatRequest) => {
    return await Service.groupChatService.createGroupChat(groupChatRequest);
  }
);

export const groupChatSlice = createSlice({
  name: "groupChat",
  initialState,
  reducers: {
    resetLoadCreateGroupChat: (state) => {
      state.loadCreateGroupChat = ApiLoadingStatus.None;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createGroupChat.pending, (state) => {
        state.loadCreateGroupChat = ApiLoadingStatus.Loading;
      })
      .addCase(createGroupChat.fulfilled, (state, action) => {
        console.log(action)
        state.loadCreateGroupChat = ApiLoadingStatus.Success;
      })
      .addCase(createGroupChat.rejected, (state, action) => {
        console.log(action)
        state.loadCreateGroupChat = ApiLoadingStatus.Failed;
      });
  },
});

export const { resetLoadCreateGroupChat } = groupChatSlice.actions;

export default groupChatSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";
import { ApiLoadingStatus } from "../../utils/loadingStatus";
import { createAsyncThunkWrap } from "../handler";
import {
  MessageSchema,
  MessageRequest,
  Service,
  GroupChatRequest,
  GroupChatSchema,
} from "../../api";

interface IGroupChatState {
  data: GroupChatSchema[];
  loadCreateGroupChat: ApiLoadingStatus;
  loadGetGroupChat: ApiLoadingStatus;
}

const initialState: IGroupChatState = {
  data: [],
  loadCreateGroupChat: ApiLoadingStatus.None,
  loadGetGroupChat: ApiLoadingStatus.None,
};

export const createGroupChat = createAsyncThunkWrap(
  "/groupChat",
  async (groupChatRequest: GroupChatRequest) => {
    return await Service.groupChatService.createGroupChat(groupChatRequest);
  }
);

export const getGroupChat = createAsyncThunkWrap(
  "/groupChat/get",
  async (id: string) => {
    return await Service.groupChatService.getGroupChat(id);
  }
);

export const groupChatSlice = createSlice({
  name: "groupChat",
  initialState,
  reducers: {
    resetLoadCreateGroupChat: (state) => {
      state.loadCreateGroupChat = ApiLoadingStatus.None;
    },
    resetGetCreateGroupChat: (state) => {
      state.loadGetGroupChat = ApiLoadingStatus.None;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createGroupChat.pending, (state) => {
        state.loadCreateGroupChat = ApiLoadingStatus.Loading;
      })
      .addCase(createGroupChat.fulfilled, (state, action) => {
        state.loadCreateGroupChat = ApiLoadingStatus.Success;
      })
      .addCase(createGroupChat.rejected, (state, action) => {
        state.loadCreateGroupChat = ApiLoadingStatus.Failed;
      })
      .addCase(getGroupChat.pending, (state) => {
        state.loadGetGroupChat = ApiLoadingStatus.Loading;
      })
      .addCase(getGroupChat.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loadGetGroupChat = ApiLoadingStatus.Success;
      })
      .addCase(getGroupChat.rejected, (state, action) => {
        state.loadGetGroupChat = ApiLoadingStatus.Failed;
      });
  },
});

export const { resetLoadCreateGroupChat, resetGetCreateGroupChat } =
  groupChatSlice.actions;

export default groupChatSlice.reducer;

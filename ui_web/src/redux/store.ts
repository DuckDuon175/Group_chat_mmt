import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./reducer/userSlice";
import chatReducer from "./reducer/chatSlice";
import groupChatReducer from "./reducer/groupChatSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    chat: chatReducer,
    groupChat: groupChatReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
  devTools: true,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

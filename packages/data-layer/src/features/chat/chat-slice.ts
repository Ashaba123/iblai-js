import { createSlice, Slice, type PayloadAction } from "@reduxjs/toolkit";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export interface ChatState {
  messages: Message[];
}

const initialState: ChatState = {
  messages: [],
};

export const chatSlice: Slice<ChatState> = createSlice({
  name: "chat",
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload);
    },
    clearMessages: (state) => {
      state.messages = [];
    },
  },
});

export const { addMessage, clearMessages } = chatSlice.actions;

export default chatSlice.reducer;

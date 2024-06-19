import { SET_CHATS, SET_SELECTED_CHAT, OPEN_CHAT, CLOSE_CHAT } from "../actions";

const initialState = {
  chats: [],
  selectedChat: null,
  openChats: [],
};

const chatReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_CHATS:
      return {
        ...state,
        chats: action.payload,
      };
    case SET_SELECTED_CHAT:
      return {
        ...state,
        selectedChat: action.payload,
      };
    case OPEN_CHAT:
      return {
        ...state,
        openChats: [...state.openChats, action.payload],
      };
    case CLOSE_CHAT:
      return {
        ...state,
        openChats: state.openChats.filter((chatId) => chatId !== action.payload),
      };
    default:
      return state;
  }
};

export default chatReducer;

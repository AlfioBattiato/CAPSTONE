import { combineReducers } from "redux";
import {
  SET_CHATS,
  SET_SELECTED_CHAT,
  OPEN_CHAT,
  CLOSE_CHAT,
  SET_UNREAD_COUNT,
  INCREMENT_UNREAD_COUNT,
  DECREMENT_UNREAD_COUNT,
  RESET_UNREAD_COUNT,
  RESET_CHATS,
  ADD_CHAT,
  SET_CHAT_FILTER,
} from "../actions";

const initialState = {
  chats: [],
  selectedChat: null,
  openChats: [],
  unreadCounts: {},
  chatFilter: "all",
};

const chatReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_CHAT:
      return {
        ...state,
        chats: [...state.chats, action.payload],
      };
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
    case RESET_CHATS:
      return initialState;
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
    case SET_UNREAD_COUNT:
      return {
        ...state,
        unreadCounts: {
          ...state.unreadCounts,
          [action.payload.chatId]: action.payload.count,
        },
      };
    case INCREMENT_UNREAD_COUNT:
      return {
        ...state,
        unreadCounts: {
          ...state.unreadCounts,
          [action.payload]: (state.unreadCounts[action.payload] || 0) + 1,
        },
      };
    case DECREMENT_UNREAD_COUNT:
      return {
        ...state,
        unreadCounts: {
          ...state.unreadCounts,
          [action.payload]: Math.max(0, (state.unreadCounts[action.payload] || 0) - 1),
        },
      };
    case RESET_UNREAD_COUNT:
      return {
        ...state,
        unreadCounts: {
          ...state.unreadCounts,
          [action.payload]: 0,
        },
      };
    case SET_CHAT_FILTER:
      return {
        ...state,
        chatFilter: action.payload,
      };
    default:
      return state;
  }
};

export default chatReducer;

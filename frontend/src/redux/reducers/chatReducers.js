import {
  SET_CHATS,
  SET_SELECTED_CHAT,
  OPEN_CHAT,
  CLOSE_CHAT,
  SET_UNREAD_COUNT,
  INCREMENT_UNREAD_COUNT,
  RESET_UNREAD_COUNT,
  // SET_HAS_UNREAD_MESSAGES,
} from "../actions";

const initialState = {
  chats: [],
  selectedChat: null,
  openChats: [],
  unreadCounts: {},
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
    case RESET_UNREAD_COUNT:
      return {
        ...state,
        unreadCounts: {
          ...state.unreadCounts,
          [action.payload]: 0,
        },
      };
    // case SET_HAS_UNREAD_MESSAGES:
    //   return {
    //     ...state,
    //     hasUnreadMessages: {
    //       ...state.hasUnreadMessages,
    //       [action.payload.chatId]: action.payload.hasUnread,
    //     },
    //   };
    default:
      return state;
  }
};

export default chatReducer;

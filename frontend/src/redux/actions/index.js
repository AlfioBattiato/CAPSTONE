import { eachQuarterOfInterval } from "date-fns";

// Auth
export const LOGIN = "login";
export const LOGOUT = "logout";

// Chat
export const OPEN_CHAT = "OPEN_CHAT";
export const CLOSE_CHAT = "CLOSE_CHAT";

export const SET_CHATS = "SET_CHATS";
export const SET_SELECTED_CHAT = "SET_SELECTED_CHAT";
export const RESET_CHATS = "RESET_CHATS";

// export const SET_HAS_UNREAD_MESSAGES = "SET_HAS_UNREAD_MESSAGES";
export const SET_UNREAD_COUNT = "SET_UNREAD_COUNT";
export const INCREMENT_UNREAD_COUNT = "INCREMENT_UNREAD_COUNT";
export const DECREMENT_UNREAD_COUNT = "DECREMENT_UNREAD_COUNT";
export const RESET_UNREAD_COUNT = "RESET_UNREAD_COUNT";

// Travel
export const SET_ALLTRAVELS = "SET_ALLTRAVELS";
export const SET_TRAVEL = "SET_TRAVEL";
export const REMOVE_META = "REMOVE_META";
export const SET_INSTRUCTIONS = "SET_INSTRUCTIONS";
export const SET_FORMDATA = "SET_FORMDATA";
export const SET_INTERESTPLACES = "SET_INTERESTPLACES";
export const SET_METAS = "SET_METAS";
export const SET_EXPIRATION = "SET_EXPIRATION";
export const SET_ALL = "SET_ALL";

// chat////////

// OPEN
export const openChat = (chatId) => {
  // console.log(`openChat called with chatId: ${chatId}`);
  return {
    type: OPEN_CHAT,
    payload: chatId,
  };
};

export const closeChat = (chatId) => {
  // console.log(`closeChat called with chatId: ${chatId}`);
  return {
    type: CLOSE_CHAT,
    payload: chatId,
  };
};

// SET
export const setChats = (chats) => {
  // console.log(`setChats called with chats:`, chats);
  return {
    type: SET_CHATS,
    payload: chats,
  };
};

export const setSelectedChat = (chat) => {
  // console.log(`setSelectedChat called with chat:`, chat);
  return {
    type: SET_SELECTED_CHAT,
    payload: chat,
  };
};

export const resetChats = () => {
  // console.log(`resetChats called`);
  return {
    type: RESET_CHATS,
  };
};

// NOTIFICATION

// export const setHasUnreadMessages = (chatId, hasUnread) => ({
//   type: SET_HAS_UNREAD_MESSAGES,
//   payload: { chatId, hasUnread },
// });

export const setUnreadCount = (chatId, count) => {
  // console.log(`setUnreadCount called with chatId: ${chatId}, count: ${count}`);
  return {
    type: SET_UNREAD_COUNT,
    payload: { chatId, count },
  };
};

export const incrementUnreadCount = (chatId) => {
  // console.log(`incrementUnreadCount called with chatId: ${chatId}`);
  return {
    type: INCREMENT_UNREAD_COUNT,
    payload: chatId,
  };
};

export const decrementUnreadCount = (chatId) => {
  // console.log(`decrementUnreadCount called with chatId: ${chatId}`);
  return {
    type: DECREMENT_UNREAD_COUNT,
    payload: chatId,
  };
};

export const resetUnreadCount = (chatId) => {
  // console.log(`resetUnreadCount called with chatId: ${chatId}`);
  return {
    type: RESET_UNREAD_COUNT,
    payload: chatId,
  };
};

// viaggi////////
export const setActionTravels = (alltravels) => ({
  type: SET_ALLTRAVELS,
  payload: alltravels,
});

export const setCurrentTravel = (obj) => ({
  type: SET_TRAVEL,
  payload: obj,
});
export const setmapInstructions = (obj) => ({
  type: SET_INSTRUCTIONS,
  payload: obj,
});
export const setFormData = (obj) => ({
  type: SET_FORMDATA,
  payload: obj,
});

export const removeMeta = (index) => ({
  type: REMOVE_META,
  payload: index,
});
export const setInterestPlaces = (places) => ({
  type: SET_INTERESTPLACES,
  payload: places,
});
export const setMetas = (meta) => ({
  type: SET_METAS,
  payload: meta,
});
export const setExpiration = (obj) => ({
  type: SET_EXPIRATION,
  payload: obj,
});
export const setAllreduxTravel = (obj) => ({
  type: SET_ALL,
  payload: obj,
});

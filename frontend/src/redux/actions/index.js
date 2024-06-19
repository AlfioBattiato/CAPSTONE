// Auth
export const LOGIN = "login";
export const LOGOUT = "logout";

// Chat
export const OPEN_CHAT = "OPEN_CHAT";
export const CLOSE_CHAT = "CLOSE_CHAT";

export const SET_CHATS = "SET_CHATS";
export const SET_SELECTED_CHAT = "SET_SELECTED_CHAT";

// export const SET_HAS_UNREAD_MESSAGES = "SET_HAS_UNREAD_MESSAGES";
export const SET_UNREAD_COUNT = "SET_UNREAD_COUNT";
export const INCREMENT_UNREAD_COUNT = "INCREMENT_UNREAD_COUNT";
export const DECREMENT_UNREAD_COUNT = "DECREMENT_UNREAD_COUNT";
export const RESET_UNREAD_COUNT = "RESET_UNREAD_COUNT";

// Travel
export const SET_ALLTRAVELS = "SET_ALLTRAVELS";
export const SET_TRAVEL = "SET_TRAVEL";
export const REMOVE_META = "REMOVE_META";

// chat////////

// OPEN
export const openChat = (chatId) => ({
  type: OPEN_CHAT,
  payload: chatId,
});

export const closeChat = (chatId) => ({
  type: CLOSE_CHAT,
  payload: chatId,
});

// SET
export const setChats = (chats) => ({
  type: SET_CHATS,
  payload: chats,
});

export const setSelectedChat = (chat) => ({
  type: SET_SELECTED_CHAT,
  payload: chat,
});

// NOTIFICATION

// export const setHasUnreadMessages = (chatId, hasUnread) => ({
//   type: SET_HAS_UNREAD_MESSAGES,
//   payload: { chatId, hasUnread },
// });

export const setUnreadCount = (chatId, count) => ({
  type: SET_UNREAD_COUNT,
  payload: { chatId, count },
});

export const incrementUnreadCount = (chatId) => ({
  type: INCREMENT_UNREAD_COUNT,
  payload: chatId,
});

export const decrementUnreadCount = (chatId) => ({
  type: DECREMENT_UNREAD_COUNT,
  payload: chatId,
});

export const resetUnreadCount = (chatId) => ({
  type: RESET_UNREAD_COUNT,
  payload: chatId,
});

// viaggi////////
export const setActionTravels = (alltravels) => ({
  type: SET_ALLTRAVELS,
  payload: alltravels,
});

export const setCurrentTravel = (obj) => ({
  type: SET_TRAVEL,
  payload: obj,
});

export const removeMeta = (index) => ({
  type: REMOVE_META,
  payload: index,
});

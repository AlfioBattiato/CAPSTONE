export const LOGIN = "login";
export const LOGOUT = "logout";

export const OPEN_CHAT = "OPEN_CHAT";
export const CLOSE_CHAT = "CLOSE_CHAT";
export const SET_CHATS = "SET_CHATS";
export const SET_SELECTED_CHAT = "SET_SELECTED_CHAT";

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

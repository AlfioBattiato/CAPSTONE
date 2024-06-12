export const LOGIN = "login";
export const LOGOUT = "logout";

export const SET_CHATS = "SET_CHATS";
export const SET_SELECTED_CHAT = "SET_SELECTED_CHAT";
export const SET_TRAVELS = "SET_TRAVELS";

export const setChats = (chats) => ({
  type: SET_CHATS,
  payload: chats,
});

export const setSelectedChat = (chat) => ({
  type: SET_SELECTED_CHAT,
  payload: chat,
});
export const setTravels = (travels) => ({
  type: SET_TRAVELS,
  payload: travels,
});

export const LOGIN = "login";
export const LOGOUT = "logout";

export const SET_CHATS = "SET_CHATS";
export const SET_SELECTED_CHAT = "SET_SELECTED_CHAT";
export const SET_ALLTRAVELS = "SET_ALLTRAVELS";
export const SET_TRAVEL = "SET_TRAVEL";
export const REMOVE_META = "REMOVE_META";
export const SET_INSTRUCTIONS = "SET_INSTRUCTIONS";
export const SET_FORMDATA = "SET_FORMDATA";

// chat////////
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
  payload: index
});

// import { configureStore } from "@reduxjs/toolkit";
// import mainReducer from "../reducers";

// const store = configureStore({
//   reducer: mainReducer,
// });

// export default store;

import { configureStore, combineReducers } from "@reduxjs/toolkit";
import mainReducer from "../reducers";
import chatReducer from "../reducers/chatReducers";
import travelsReducer from "../reducers/travelsReducers";
import { SET_TRAVEL } from "../actions";

const unifiedReducer = combineReducers({
  auth: mainReducer,
  chats: chatReducer,
  infotravels: travelsReducer,
});

const store = configureStore({
  reducer: unifiedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;

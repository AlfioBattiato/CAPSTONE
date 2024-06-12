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

const unifiedReducer = combineReducers({
  auth: mainReducer,
  chats: chatReducer,
  infotravels: travelsReducer,
});

const store = configureStore({
  reducer: unifiedReducer,
});

export default store;

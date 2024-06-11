// import { configureStore } from "@reduxjs/toolkit";
// import mainReducer from "../reducers";

// const store = configureStore({
//   reducer: mainReducer,
// });

// export default store;

import { configureStore, combineReducers } from "@reduxjs/toolkit";
import mainReducer from "../reducers";
import chatReducer from "../reducers/chatReducers";

const unifiedReducer = combineReducers({
  auth: mainReducer,
  chat: chatReducer,
});

const store = configureStore({
  reducer: unifiedReducer,
});

export default store;

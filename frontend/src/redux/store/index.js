import { configureStore } from "@reduxjs/toolkit";
import mainReducer from "../reducers";

const store = configureStore({
  reducer: mainReducer,
});

export default store;

// import { configureStore, combineReducers } from "@reduxjs/toolkit";
// import authReducer from "../reducers/authReducers";
// import chatReducer from "../reducers/chatReducers";

// const unifiedReducer = combineReducers({
//   auth: authReducer,
//   chat: chatReducer,
// });

// const store = configureStore({
//   reducer: unifiedReducer,
// });

// export default store;

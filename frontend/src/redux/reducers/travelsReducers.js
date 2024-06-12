import { SET_TRAVELS } from "../actions";


const initialState = {
  travels: [],
};

const travelsReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_TRAVELS:
      return {
        ...state,
        travels: action.payload,
      };
  
    default:
      return state;
  }
};

export default travelsReducer;

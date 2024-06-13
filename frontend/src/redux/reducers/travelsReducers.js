import { SET_TRAVELS, SET_FILTERS } from "../actions";

const initialState = {
  travels: [],
  filters: {
    startDate: null,
    city: "",
    cc: null,
    participants: null,
    days: null,
    types: {
      scooter: false,
      raceBikes: false,
      motocross: false,
      offRoad: false,
      harley: false,
    },
  },
};

const travelsReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_TRAVELS:
      return {
        ...state,
        travels: action.payload,
      };
    case SET_FILTERS:
      return {
        ...state,
        filters: action.payload,
      };
    default:
      return state;
  }
};

export default travelsReducer;

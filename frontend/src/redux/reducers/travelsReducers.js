import { SET_ALLTRAVELS, SET_TRAVEL } from "../actions";

const initialState = {
  alltravels: [],
  setTravel: {
    start_location: {
      city: '',
      lat: 0,
      lon: 0,
    },
    metas: [],
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
    case SET_ALLTRAVELS:
      return {
        ...state,
        alltravels: action.payload,
      };
    case SET_TRAVEL:
      return {
        ...state,
        setTravel: action.payload,
      };
    default:
      return state;
  }
};

export default travelsReducer;

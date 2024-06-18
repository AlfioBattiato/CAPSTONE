import { REMOVE_META, SET_ALLTRAVELS, SET_TRAVEL } from "../actions";

const initialState = {
  alltravels: [],
  setTravel: {
    start_location: {
      city: '',
      lat: 0,
      lon: 0,
    },
    metas: [],
    map_instructions:[],
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
      case REMOVE_META:
      return {
          ...state,
          setTravel: {
              ...state.setTravel,
              metas: state.setTravel.metas.filter((_, index) => index !== action.payload)
          }
      };
    default:
      return state;
  }
};

export default travelsReducer;

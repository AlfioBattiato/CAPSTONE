import { REMOVE_META, SET_ALLTRAVELS, SET_EXPIRATION, SET_FORMDATA, SET_INSTRUCTIONS, SET_INTERESTPLACES, SET_METAS, SET_TRAVEL } from "../actions";

const initialState = {
  alltravels: [],
  setTravel: {
    start_location: {
      city: '',
      lat: 0,
      lon: 0,
    },
    startDate: null,
    city: "",
    cc_moto: null,
    participants: null,
    type_moto: null,
    inputDisable: false
  },
  map_instructions: [],
  formData: {
    query: '',
    metaQuery: ''
  },
  interestPlaces: [],
  metas: [],
  details: {
    days: null,
    expiration_date: null,
  }
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
    case SET_METAS:
      return {
        ...state,
        metas: action.payload,
      };
    case REMOVE_META:
      return {
        ...state,
        metas: state.metas.filter((_, index) => index !== action.payload),
      };
    case SET_INSTRUCTIONS:
      return {
        ...state,
        map_instructions: action.payload,
      };
    case SET_FORMDATA:
      return {
        ...state,
        formData: action.payload,
      };
    case SET_INTERESTPLACES:
      return {
        ...state,
        interestPlaces: action.payload,
      };
    case SET_EXPIRATION:
      return {
        ...state,
        details: action.payload,
      };
    default:
      return state;
  }
};

export default travelsReducer;

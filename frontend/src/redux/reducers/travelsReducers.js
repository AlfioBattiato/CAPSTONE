import { REMOVE_META, SET_ALLTRAVELS, SET_FORMDATA, SET_INSTRUCTIONS, SET_INTERESTPLACES, SET_TRAVEL } from "../actions";

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
    cc_moto: null,
    participants: null,
    days: null,
    type_moto: null,
    inputDisable: false
  },
  map_instructions: [],
  formData: {
    query: '',
    metaQuery: ''
  },
  interestPlaces:[],
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
    default:
      return state;
  }
};

export default travelsReducer;

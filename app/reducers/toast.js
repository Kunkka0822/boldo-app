import * as actionTypes from "@actions/actionTypes";
const initialState = {
  toast:null
};

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case actionTypes.PREF_TOAST:
        return {
          toast: action.data
        };
    default:
      return state;
  }
};

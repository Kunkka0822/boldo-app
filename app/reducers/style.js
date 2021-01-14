import * as actionTypes from "@actions/actionTypes";
const initialState = {
  style: {
    success: false
  },
};

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case actionTypes.PREF_STYLES:
        return {
          styles: action.data
        };
    default:
      return state;
  }
};

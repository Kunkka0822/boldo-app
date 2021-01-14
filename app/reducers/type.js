import * as actionTypes from "@actions/actionTypes";
const initialState = {
  type: {
    success: false
  },
};

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case actionTypes.PREF_TYPES:
        return {
          types: action.data
        };
    default:
      return state;
  }
};

import * as actionTypes from "@actions/actionTypes";
const initialState = {
  notification: {
    success: false
  },
};

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case actionTypes.PREF_NOTIFICATIONS:
        return {
          notifications: action.data
        };
    default:
      return state;
  }
};

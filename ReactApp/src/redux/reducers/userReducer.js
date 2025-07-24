const initialState = {
  userInfo: null,
  loading: false,
  error: null,
};

export const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'USER_LOGIN_REQUEST':
    case 'USER_REGISTER_REQUEST':
      return { ...state, loading: true };
    case 'USER_LOGIN_SUCCESS':
    case 'USER_REGISTER_SUCCESS':
      return { loading: false, userInfo: action.payload };
    case 'USER_LOGIN_FAIL':
    case 'USER_REGISTER_FAIL':
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export default userReducer
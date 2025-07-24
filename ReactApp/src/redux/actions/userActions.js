import axios from 'axios';

export const login = (email, password) => async (dispatch) => {
  try {
    dispatch({ type: 'USER_LOGIN_REQUEST' });
    const { data } = await axios.post('/api/users/login', { email, password });
    dispatch({ type: 'USER_LOGIN_SUCCESS', payload: data });
  } catch (error) {
    dispatch({ type: 'USER_LOGIN_FAIL', payload: error.response.data.message });
  }
};

export const register = (formData) => async (dispatch) => {
  try {
    dispatch({ type: 'USER_REGISTER_REQUEST' });
    const { data } = await axios.post('/api/users/register', formData);
    dispatch({ type: 'USER_REGISTER_SUCCESS', payload: data });
  } catch (error) {
    dispatch({ type: 'USER_REGISTER_FAIL', payload: error.response.data.message });
  }
};

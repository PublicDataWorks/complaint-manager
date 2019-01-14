import { push } from "connected-react-router";

const unauthorizedResponseInterceptor = dispatch => error => {
  if (error.response.status === 401) {
    dispatch(push("/login"));
  }
  return Promise.reject(error);
};

export default unauthorizedResponseInterceptor;

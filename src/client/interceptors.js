import axios from "axios";
import { push } from "react-router-redux";
import getAccessToken from "./auth/getAccessToken";

export default function(store) {
  axios.interceptors.response.use(
    response => response,
    error => {
      if (error.response.status === 401) {
        store.dispatch(push("/login"));
      }
      return Promise.reject(error);
    }
  );
  axios.interceptors.request.use(
    ensureToken(store.dispatch)
  )
}

export const ensureToken = dispatch => config => {
  const token = getAccessToken();
  if (!token) {
    dispatch(push("/login"));
    throw new Error("No access token found");
  }
  return {
    ...config,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    }
  }
}

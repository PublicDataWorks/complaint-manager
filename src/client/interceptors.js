import axios from "axios";
import { push } from "connected-react-router";

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
}

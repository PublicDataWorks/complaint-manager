import axios from "axios";
import ensureTokenOnRequestInterceptor from "./ensureTokenOnRequestInterceptor";
import unauthorizedResponseInterceptor from "./unauthorizedResponseInterceptor";

export default function(store) {
  axios.interceptors.request.use(
    ensureTokenOnRequestInterceptor(store.dispatch)
  );
  axios.interceptors.response.use(
    response => response,
    unauthorizedResponseInterceptor(store.dispatch)
  );
}

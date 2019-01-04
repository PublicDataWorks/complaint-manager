import axios from "axios";
import ensureTokenOnRequestInterceptor from "./ensureTokenOnRequestInterceptor";
import unauthorizedResponseInterceptor from "./unauthorizedResponseInterceptor";
import config from "../config/config";

axios.defaults.baseURL = `${config[process.env.NODE_ENV].hostname}`;

export default function(store) {
  axios.interceptors.request.use(
    ensureTokenOnRequestInterceptor(store.dispatch)
  );
  axios.interceptors.response.use(
    response => response,
    unauthorizedResponseInterceptor(store.dispatch)
  );
}

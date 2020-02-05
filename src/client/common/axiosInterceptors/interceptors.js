import axios from "axios";
import ensureTokenOnRequestInterceptor from "./ensureTokenOnRequestInterceptor";
import ensureOnlineOnRequestInterceptor from "./ensureOnlineOnRequestInterceptor";
import responseErrorInterceptor from "./responseErrorInterceptor";
import config from "../config/config";

axios.defaults.baseURL = `${config[process.env.REACT_APP_ENV].hostname}`;

export default function(store) {
  axios.interceptors.request.use(
    ensureOnlineOnRequestInterceptor(store.dispatch)
  );
  axios.interceptors.request.use(
    ensureTokenOnRequestInterceptor(store.dispatch)
  );
  axios.interceptors.response.use(
    response => response,
    responseErrorInterceptor(store.dispatch)
  );
}

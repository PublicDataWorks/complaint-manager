import { cloneDeep } from 'lodash';
import axios from "axios";
import ensureTokenOnRequestInterceptor from "./ensureTokenOnRequestInterceptor";
import ensureOnlineOnRequestInterceptor from "./ensureOnlineOnRequestInterceptor";
import responseErrorInterceptor from "./responseErrorInterceptor";
import allConfigs from "../config/config";
import { isAuthDisabled } from "../../isAuthDisabled";

const currentConfig = allConfigs[process.env.REACT_APP_ENV] || {};

const baseURL = `${currentConfig.hostname}`;
axios.defaults.baseURL = baseURL;

export default async function (store) {
  axios.interceptors.request.use(
    ensureOnlineOnRequestInterceptor(store.dispatch)
  );

  axios.interceptors.request.use(
    ensureTokenOnRequestInterceptor(store.dispatch, isAuthDisabled())
  );

  axios.interceptors.response.use(
    response => response,
    responseErrorInterceptor(store.dispatch)
  );
}

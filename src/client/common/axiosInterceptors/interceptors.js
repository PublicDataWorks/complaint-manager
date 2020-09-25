import { get } from 'lodash';
import axios from 'axios';
import ensureTokenOnRequestInterceptor from './ensureTokenOnRequestInterceptor';
import ensureOnlineOnRequestInterceptor from './ensureOnlineOnRequestInterceptor';
import responseErrorInterceptor from './responseErrorInterceptor';
import allConfigs from '../config/config';

const currentConfig = allConfigs[process.env.REACT_APP_ENV] || {};

const baseURL = `${currentConfig.hostname}`;
axios.defaults.baseURL = baseURL;

const isLowerEnv = baseURL.includes('localhost') || baseURL.includes('app-e2e');
const isAuthDisabled = get(currentConfig, ['auth', 'disabled'], false);

export default async function (store) {
  axios.interceptors.request.use(ensureOnlineOnRequestInterceptor(store.dispatch));

  axios.interceptors.request.use(
    ensureTokenOnRequestInterceptor(store.dispatch, (isLowerEnv && isAuthDisabled))
  );
  
  axios.interceptors.response.use(
    response => response,
    responseErrorInterceptor(store.dispatch)
  );
};;

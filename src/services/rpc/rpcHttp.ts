import axios from 'axios';
import { getConfig } from '@src/config';

const TIMEOUT = 20000;
const instance = axios.create({
  timeout: TIMEOUT,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
    'Access-Control-Allow-Headers': 'Content-Type, Cache-Control, X-Requested-With, X-CSRF-Token, Discourse-Visible, User-Api-Key, User-Api-Client-Id, *',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, PUT, GET, OPTIONS, DELETE',
  }
});

instance.interceptors.request.use((req) => {
  req.baseURL = getConfig().chainURL;

  return req;
});

instance.interceptors.response.use(res => {
  const result = res?.data?.Result;
  const error = res?.data?.Error;

  if (error) {
    return Promise.reject(error);
  }

  return Promise.resolve(result);
}, errorData => {
  const errResponse = errorData?.response;

  // can not get response, alert to user
  if (errorData?.isAxiosError && !errResponse) {
    throw new Error('Send request RPC failed');
  }

  return Promise.reject(errorData);
});

export default instance;

/**
 * Document: https://github.com/axios/axios#instance-methodsaxios#request(config)
    axios#get(url[, config])
    axios#delete(url[, config])
    axios#head(url[, config])
    axios#options(url[, config])
    axios#post(url[, data[, config]])
    axios#put(url[, data[, config]])
    axios#patch(url[, data[, config]])
    axios#getUri([config])
 */

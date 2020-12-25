import axios from 'axios';
import { getConfig } from '@src/config';

const TIMEOUT = 20000;
const instance = axios.create({
  timeout: TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    Authorization:
      'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFhQUBpbmNvZ25pdG8ub3JnIiwiZXhwIjoxODk4NTg1MzEwLCJpZCI6NjM5Nywib3JpZ19pYXQiOjE1ODQwODkzMTB9.vT600Op7gpa5467RI6APJj9UREj9_olhg_v-57FtZUk',
  },
});

instance.interceptors.request.use((req) => {
  req.baseURL = getConfig().apiURL;
  return req;
});

instance.interceptors.response.use(
  (res) => {
    const result = res?.data?.Result;
    const error = res?.data?.Error;
    if (error) {
      return Promise.reject(error);
    }
    return Promise.resolve(result);
  },
  (errorData) => {
    const errResponse = errorData?.response;
    // can not get response, alert to user
    if (errorData?.isAxiosError && !errResponse) {
      throw new Error('Send request RPC failed');
    }
    return Promise.reject(errorData);
  }
);

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

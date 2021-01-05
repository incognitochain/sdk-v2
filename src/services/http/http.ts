/* eslint-disable no-undef */
import { getToken } from '@src/config';
import axios from 'axios';
import { getConfig } from '@src/config';

let currentAccessToken = '';
const TIMEOUT = 20000;
const instance = axios.create({
  timeout: TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

instance.interceptors.request.use(
  (req) => {
    const { apiURL } = getConfig();
    req.baseURL = apiURL;
    req.headers = {
      ...req.headers,
      Authorization: `Bearer ${currentAccessToken}`,
    };
    return req;
  },
  (error) => {
    Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (res) => {
    const result = res?.data?.Result;
    const error = res?.data?.Error;
    if (error) {
      return Promise.reject(error);
    }
    return Promise.resolve(result);
  },
  async (error) => {
    const originalRequest = error?.config;
    if (error?.response?.status === 401) {
      L.error('Token was expired!');
      await setTokenHeader();
      return instance(originalRequest);
    }
    if (error?.isAxiosError && !error?.response) {
      throw new Error('Send request API failed');
    }
    return Promise.reject(error);
  }
);

export const setTokenHeader = async () => {
  const { deviceId, deviceToken } = getConfig();
  const token = await getToken(deviceId, deviceToken);
  if (!token) {
    throw new Error('Can not set token request');
  }
  currentAccessToken = token;
  axios.defaults.headers.Authorization = `Bearer ${token}`;
};

export default instance;

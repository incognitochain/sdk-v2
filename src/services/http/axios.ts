import axios from 'axios';

const createAxiosInstance = ({ baseURL }: { baseURL: string }) => {
  const TIMEOUT = 20000;
  const instance = axios.create({
    timeout: TIMEOUT,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  instance.interceptors.request.use(
    (req) => {
      req.baseURL = baseURL;
      req.headers = {
        ...req.headers,
      };
      return req;
    },
    (error) => {
      Promise.reject(error);
    }
  );

  instance.interceptors.response.use(
    (res) => Promise.resolve(res?.data),
    async (error) => {
      if (error?.isAxiosError && !error?.response) {
        throw new Error('Send request API failed');
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

export default createAxiosInstance;

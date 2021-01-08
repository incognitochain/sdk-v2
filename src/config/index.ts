import { http } from '@src/services/http';
interface ISetConfig {
  logMethod: (message: string) => void;
  chainURL: string;
  apiURL: string;
  mainnet: boolean;
  wasmPath: string;
  api2URL?: string;
  deviceId: string;
  deviceToken: string;
}

interface IConfig {
  logMethod: (message: string) => void;
  chainURL: string;
  apiURL: string;
  mainnet: boolean;
  wasmPath: string;
  api2URL: string;
  deviceId: string;
  deviceToken: string;
  token: string;
}

// default config
let config: IConfig = {
  chainURL: '',
  apiURL: '',
  logMethod: console.log,
  mainnet: ENV.MAINNET,
  wasmPath: '',
  api2URL: '',
  deviceId: '',
  deviceToken: '',
  token: '',
};

export function getConfig() {
  const apiURL =
    config.apiURL ||
    (config.mainnet
      ? ENV.DEFAULT_API_URL_MAINNET
      : ENV.DEFAULT_API_URL_TESTNET);
  const chainURL =
    config.chainURL ||
    (config.mainnet
      ? ENV.DEFAULT_CHAIN_URL_MAINNET
      : ENV.DEFAULT_CHAIN_URL_TESTNET);
  const api2URL =
    config.api2URL ||
    (config.mainnet
      ? ENV.DEFAULT_API_2_URL_MAINNET
      : ENV.DEFAULT_API_2_URL_TESTNET);
  return {
    ...config,
    apiURL,
    chainURL,
    api2URL,
  };
}

export const getToken = (deviceId: string, deviceToken: string) => {
  if (!deviceId) throw new Error('Missing device ID');
  if (!deviceToken) throw new Error('Missing device token');
  return http
    .post('/auth/new-token', {
      DeviceID: deviceId,
      DeviceToken: deviceToken,
    })
    .then((res: any) => res?.Token);
};

export const setConfig = (newConfig: ISetConfig) => {
  config = {
    ...config,
    ...newConfig,
  };
};

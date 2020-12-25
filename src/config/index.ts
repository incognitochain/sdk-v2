type ConfigName = 'chainURL' | 'logMethod';

type Config = {
  logMethod: (message: string) => void;
  chainURL: string;
  apiURL: string;
  mainnet: boolean;
  wasmPath: string;
  api2URL?: string;
};

type SetConfigName = {
  logMethod?: (message: string) => void;
  chainURL?: string;
  apiURL?: string;
  mainnet?: boolean;
  wasmPath?: string;
  api2URL?: string;
};

// default config
let config: Config = {
  chainURL: null,
  apiURL: null,
  logMethod: console.log,
  mainnet: ENV.MAINNET,
  wasmPath: null,
  api2URL: null,
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

export function setConfig(newConfig: SetConfigName) {
  config = {
    ...config,
    ...newConfig,
  };
}

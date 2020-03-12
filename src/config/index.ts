type ConfigName = 'chainURL' | 'logMethod';

type Config = {
  logMethod: (message: string) => void;
  chainURL: string;
  apiURL: string;
  mainnet: boolean;
};

type SetConfigName = {
  logMethod?: (message: string) => void;
  chainURL?: string;
  apiURL?: string;
  mainnet?: boolean;
};

// default config
let config: Config = {
  chainURL: ENV.MAINNET ? ENV.DEFAULT_CHAIN_URL_MAINNET : ENV.DEFAULT_CHAIN_URL_TESTNET,
  apiURL: ENV.MAINNET ? ENV.DEFAULT_API_URL_MAINNET : ENV.DEFAULT_API_URL_TESTNET,
  logMethod: console.log,
  mainnet: ENV.MAINNET,
};

export function getConfig() {
  const apiURL = config.mainnet ? ENV.DEFAULT_API_URL_MAINNET : ENV.DEFAULT_API_URL_TESTNET;
  const chainURL = config.mainnet ? ENV.DEFAULT_CHAIN_URL_MAINNET : ENV.DEFAULT_CHAIN_URL_TESTNET;

  return {
    ...config,
    apiURL,
    chainURL
  };
}

export function setConfig(newConfig: SetConfigName) {
  config = {
    ...config,
    ...newConfig,
  };
}

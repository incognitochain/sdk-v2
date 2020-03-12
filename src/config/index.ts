type ConfigName = 'chainURL' | 'logMethod';

type Config = {
  logMethod: (message: string) => void;
  chainURL: string;
};

type SetConfigName = {
  logMethod?: (message: string) => void;
  chainURL?: string;
};

let config: Config = {
  chainURL: ENV.CHAIN_URL,
  logMethod: console.log
};

export function getConfig() {
  return config;
}

export function setConfig(newConfig: SetConfigName) {
  config = {
    ...config,
    ...newConfig
  };
}

type ConfigName = 'chainURL' | 'logMethod';

type Config = {
  logMethod: Function;
  chainURL: string;
};

type SetConfigName = {
  logMethod?: Function;
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

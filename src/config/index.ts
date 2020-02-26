type ConfigName = 'chainURL';

type Config = {
  [k in ConfigName]: string;
};

type SetConfigName = {
  [k in ConfigName]?: string;
};

let config: Config = {
  chainURL: ENV.CHAIN_URL
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

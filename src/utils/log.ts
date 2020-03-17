/**
 * Extend Javascript console.* methods
 */

import { getConfig } from "@src/config";

type TypeLog = 'info' | 'error' | 'warning';

const originMethod = {
  log: console.log
};

// // remove built-in console.log in Production
// if (ENV.IS_PROD) {
//   console.log = function(){};
// }

class Log {
  constructor(logName: string) {

    this.info(`${logName} was started.`);
    this.info('SDK CONFIG', getConfig());
  }

  _getTime() {
    return new Date().toISOString();
  }

  _getType(type: TypeLog) {
    switch(type) {
      case 'info':
        return '[Info]'
      case 'error':
        return '[Error]'
      case 'warning':
        return '[Warning]'
    }
  }

  _log(message: string, type: TypeLog) {
    const timeStr = this._getTime();
    const typeStr = this._getType(type);

    const logMethod = typeof getConfig().logMethod === 'function' ? getConfig().logMethod : originMethod.log;

    logMethod(`${typeStr}${timeStr} - ${message}`);
  }

  info(message: string, info?: any) {
    if (getConfig().logMethod) {
      const infoStr = info ? JSON.stringify(info) : '';
      return this._log(`${message} ${infoStr ? `(${infoStr})` : ''}`, 'info');
    }
  }

  error(message: string, error?: any) {
    if (getConfig().logMethod) {
      const errorMessage = error?.message || error?.Message || 'Unknown error';
      return this._log(`${message} ${errorMessage ? `(${errorMessage})` : ''}`, 'error');
    }
  }

  warning(message: string) {
    if (getConfig().logMethod) {
      return this._log(message, 'warning');
    }
  }
}

// implement to global
const GLOBAL_NAME = 'L';

if (__IS_WEB__) { // on web enviroment
  (window as { [key: string]: any })[GLOBAL_NAME] = new Log('IncognitoSDK');
} else if (__IS_NODE__) { // on Nodejs
  (global as { [key: string]: any })[GLOBAL_NAME] = new Log('IncognitoSDK');
}

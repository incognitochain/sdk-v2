export {};

interface ENV {
  CHAIN_URL: string,
  IS_PROD: boolean
};

declare global {
  interface Array<T> {
    equals: (propertyName: any) => boolean;
  }

  class Go {
    run: Function;
    importObject: any;
  }

  class ErrorCode {
    constructor(message: string);
  }

  /**
   * Log
   */
  const L : {
    info: (message: string, info?: any) => void;
    error: (message: string, error?: any) => void;
    warning: (message: string) => void;
  }

  const __IS_WEB__: boolean;
  const __IS_NODE__: boolean;
  const ENV : ENV;
  
  type KeyWalletChainCode = Uint8Array;
  type KeyWalletChildNumber = Uint8Array;
  type KeyWalletDepth = number;
  type KeyBytes = Uint8Array;
  type TokenIdType = string;
  type TokenSymbolType = string;
  type TokenNameType = string;
  type TokenTxType = number;
}

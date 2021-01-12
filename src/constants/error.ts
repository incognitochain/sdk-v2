export const ERROR_CODE: any = {
  NOT_ENOUGH_COIN: '-5',
};

export const ERROR_MESSAGE: any = {
  '-5': 'Your balance is not enough for this transaction.',
};

interface IObject {
  message: string;
  code: string;
}

class SDKError extends Error {
  message: string;
  code: string;
  constructor(code: string) {
    super();
    this.message = ERROR_MESSAGE[code] || '';
    this.code = code;
  }
}

export default SDKError;

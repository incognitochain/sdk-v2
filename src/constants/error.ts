export const ERROR_CODE = {
  NOT_ENOUGH_COIN: '-5',
};

export const ERROR_MESSAGE: any = {
  '-5': 'Your balance is insufficient.',
};

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

export const ERROR_CODE = {
  NOT_ENOUGH_COIN: '-5',
  INVALID_MNEMONIC: '-102',
};

export const ERROR_MESSAGE: any = {
  [ERROR_CODE.NOT_ENOUGH_COIN]: 'Your balance is insufficient.',
  [ERROR_CODE.INVALID_MNEMONIC]: 'That’s not quite right. Please try again.',
};

class SDKError extends Error {
  message: string;
  code: string;
  constructor(code: string) {
    super();
    this.message = `${ERROR_MESSAGE[code]} ERROR_CODE${code}` || '';
    this.code = code;
  }
}

export default SDKError;

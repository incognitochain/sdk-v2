export const ERROR_CODE = {
  NOT_ENOUGH_COIN: '-5',
  INVALID_MNEMONIC: '-102',
  UTXO: '-3006',
};

export const ERROR_MESSAGE: {
  DETECT_ERC20_ADDRESS: string;
  [x: string]: string;
} = {
  [ERROR_CODE.NOT_ENOUGH_COIN]: 'Your balance is insufficient.',
  [ERROR_CODE.INVALID_MNEMONIC]: 'That’s not quite right. Please try again.',
  DETECT_ERC20_ADDRESS: 'Address not found. Please try another.',
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

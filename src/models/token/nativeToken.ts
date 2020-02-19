import BaseTokenModel from './baseToken';

interface NativeTokenModelParam {
  tokenId: string,
  name: string,
  symbol: string
};

class NativeTokenModel extends BaseTokenModel {
  constructor({ tokenId, name, symbol } : NativeTokenModelParam) {
    super({ tokenId, name, symbol });

    this.isNativeToken = true;
  }
}

export default NativeTokenModel;
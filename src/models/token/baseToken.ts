import BaseModel from '../baseModel';

interface BaseTokenModelParam {
  tokenId: string,
  name: string,
  symbol: string
};

class BaseTokenModel extends BaseModel {
  tokenId: string;
  name: string;
  symbol: string;
  isPrivacyToken: boolean;
  isNativeToken: boolean;

  constructor({ tokenId, name, symbol } : BaseTokenModelParam) {
    super();

    this.tokenId = tokenId;
    this.name = name;
    this.symbol = symbol;
    this.isNativeToken = false;
    this.isPrivacyToken = false;
  }
}

export default BaseTokenModel;
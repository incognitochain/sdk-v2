import BaseTokenModel from './baseToken';

interface PrivacyTokenModelData {
  tokenId: string,
  name: string,
  symbol: string,
  totalSupply: string,
};

class PrivacyTokenModel extends BaseTokenModel {
  totalSupply: string;

  constructor({ tokenId, name, symbol, totalSupply } : PrivacyTokenModelData) {
    super({ tokenId, name, symbol });

    this.totalSupply = totalSupply;
    this.isPrivacyToken = true;
  }
}

export default PrivacyTokenModel;

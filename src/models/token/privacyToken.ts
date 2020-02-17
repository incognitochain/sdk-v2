import BaseTokenModel from './baseToken';

interface PrivacyTokenModelData {
  tokenId: string,
  name: string,
  symbol: string,
  totalSupply: number
};

class PrivacyTokenModel extends BaseTokenModel {
  totalSupply: number;
  isPrivacyToken: boolean;
  
  constructor({ tokenId, name, symbol, totalSupply } : PrivacyTokenModelData) {
    super({ tokenId, name, symbol });

    this.totalSupply = totalSupply;
    this.isPrivacyToken = true;
  }
}

export default PrivacyTokenModel;
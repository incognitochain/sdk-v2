import BaseModel from '../baseModel';

interface ChainTokenApiModelParamModelInterface {
  Amount: number;
  TokenID: string;
  Name: string;
  Symbol: string;
};

class ChainTokenApiModel extends BaseModel {
  supplyAmount: string;
  symbol: string;
  name: string;
  tokenId: string;

  constructor(data: ChainTokenApiModelParamModelInterface) {
    super();

    this.tokenId = data.TokenID;
    this.symbol = data.Symbol;
    this.name = data.Name;
    this.supplyAmount = data.Amount.toString();
  }
}

export default ChainTokenApiModel;

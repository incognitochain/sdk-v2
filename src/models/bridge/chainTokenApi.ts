import BaseModel from '../baseModel';

interface ChainTokenApiModelParamModelInterface {
  Amount: number;
  ID: string;
  Name: string;
  Symbol: string;
};

class ChainTokenApiModel extends BaseModel {
  supplyAmount: number;
  symbol: string;
  name: string;
  tokenId: string;

  constructor(data: ChainTokenApiModelParamModelInterface) {
    super();

    this.tokenId = data.ID;
    this.symbol = data.Symbol;
    this.name = data.Name;
    this.supplyAmount = data.Amount;
  }
}

export default ChainTokenApiModel;
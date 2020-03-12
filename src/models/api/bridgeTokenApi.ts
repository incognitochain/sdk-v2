import BaseModel from '../baseModel';

interface BridgeTokenApiModelParamModelInterface {
  TokenID: string;
  Symbol: string;
  PSymbol: string;
  Name: string;
  ContractID: string;
  Decimals: number;
  PDecimals: number;
  Status: number;
  Type: number;
  CurrencyType: number;
  Verified: boolean;
};

class BridgeTokenApiModel extends BaseModel {
  tokenId: string;
  symbol: string;
  pSymbol: string;
  name: string;
  contractID: string;
  decimals: number;
  pDecimals: number;
  status: number;
  type: number;
  currencyType: number;
  verified: boolean;

  constructor(data: BridgeTokenApiModelParamModelInterface) {
    super();

    this.tokenId = data.TokenID;
    this.symbol = data.Symbol;
    this.pSymbol = data.PSymbol;
    this.decimals = data.Decimals;
    this.pDecimals = data.PDecimals;
    this.name = data.Name;
    this.contractID = data.ContractID;
    this.status = data.Status;
    this.type = data.Type;
    this.currencyType = data.CurrencyType;
    this.verified = data.Verified;
  }
}

export default BridgeTokenApiModel;
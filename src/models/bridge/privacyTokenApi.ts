import BaseModel from '../baseModel';
import ChainTokenApiModel from './chainTokenApi';
import BridgeTokenApiModel from './bridgeTokenApi';

export interface BridgeInfoInterface {
  symbol: string;
  pSymbol: string;
  decimals: number;
  pDecimals: number;
  contractID: string;
  verified: boolean;
  type: number;
  currencyType: number;
  status: number;
  name: string;
};

interface PrivacyTokenApiModelParam {
  chainTokenInfo: ChainTokenApiModel;
  bridgeTokenInfo: BridgeTokenApiModel;
};

class PrivacyTokenApiModel extends BaseModel {
  tokenId: string;
  symbol: string;
  name: string;
  supplyAmount: number;
  bridgeInfo: BridgeInfoInterface;

  constructor(data: PrivacyTokenApiModelParam = <PrivacyTokenApiModelParam>{}) {
    super();

    this.tokenId = data.chainTokenInfo?.tokenId || data.bridgeTokenInfo?.tokenId;
    this.symbol = data.chainTokenInfo?.symbol || data.bridgeTokenInfo?.symbol;
    this.bridgeInfo = data.bridgeTokenInfo && {
      name: data.bridgeTokenInfo.name,
      pSymbol: data.bridgeTokenInfo.pSymbol,
      symbol: data.bridgeTokenInfo.symbol,
      status: data.bridgeTokenInfo.status,
      decimals: data.bridgeTokenInfo.decimals,
      pDecimals: data.bridgeTokenInfo.pDecimals,
      type: data.bridgeTokenInfo.type,
      currencyType: data.bridgeTokenInfo.currencyType,
      contractID: data.bridgeTokenInfo.contractID,
      verified: data.bridgeTokenInfo.verified,
    };
    this.name = data.chainTokenInfo?.name || data.bridgeTokenInfo?.name;
    this.supplyAmount = data.chainTokenInfo?.supplyAmount;
  }
}

export default PrivacyTokenApiModel;
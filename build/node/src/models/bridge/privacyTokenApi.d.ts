import BaseModel from "../baseModel";
import ChainTokenApiModel from "./chainTokenApi";
import BridgeTokenApiModel from "./bridgeTokenApi";
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
}
interface PrivacyTokenApiModelParam {
    chainTokenInfo: ChainTokenApiModel;
    bridgeTokenInfo: BridgeTokenApiModel;
}
declare class PrivacyTokenApiModel extends BaseModel {
    tokenId: string;
    symbol: string;
    name: string;
    supplyAmount: number;
    bridgeInfo: BridgeInfoInterface;
    constructor(data?: PrivacyTokenApiModelParam);
}
export default PrivacyTokenApiModel;
//# sourceMappingURL=privacyTokenApi.d.ts.map
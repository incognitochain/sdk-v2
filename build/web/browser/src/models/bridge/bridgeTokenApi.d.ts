import BaseModel from "../baseModel";
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
}
declare class BridgeTokenApiModel extends BaseModel {
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
    constructor(data: BridgeTokenApiModelParamModelInterface);
}
export default BridgeTokenApiModel;
//# sourceMappingURL=bridgeTokenApi.d.ts.map
import BaseTokenModel from "./baseToken";
interface PrivacyTokenModelData {
    tokenId: string;
    name: string;
    symbol: string;
    totalSupply: number;
}
declare class PrivacyTokenModel extends BaseTokenModel {
    totalSupply: number;
    constructor({ tokenId, name, symbol, totalSupply }: PrivacyTokenModelData);
}
export default PrivacyTokenModel;
//# sourceMappingURL=privacyToken.d.ts.map
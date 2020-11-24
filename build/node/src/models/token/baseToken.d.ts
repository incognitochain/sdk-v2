import BaseModel from "../baseModel";
interface BaseTokenModelParam {
    tokenId: string;
    name: string;
    symbol: string;
}
declare class BaseTokenModel extends BaseModel {
    tokenId: string;
    name: string;
    symbol: string;
    isPrivacyToken: boolean;
    isNativeToken: boolean;
    constructor({ tokenId, name, symbol }: BaseTokenModelParam);
}
export default BaseTokenModel;
//# sourceMappingURL=baseToken.d.ts.map
import BaseTokenModel from "./baseToken";
interface NativeTokenModelParam {
    tokenId: string;
    name: string;
    symbol: string;
}
declare class NativeTokenModel extends BaseTokenModel {
    constructor({ tokenId, name, symbol }: NativeTokenModelParam);
}
export default NativeTokenModel;
//# sourceMappingURL=nativeToken.d.ts.map
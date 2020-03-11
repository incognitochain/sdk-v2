/// <reference types="bn.js" />
import BaseTokenModel from "../../models/token/baseToken";
import AccountKeySetModel from "../../models/key/accountKeySet";
import PaymentInfoModel from "../../models/paymentInfo";
interface NativeTokenParam {
    tokenId: string;
    name: string;
    symbol: string;
    accountKeySet: AccountKeySetModel;
}
declare class Token implements BaseTokenModel {
    tokenId: string;
    name: string;
    symbol: string;
    accountKeySet: AccountKeySetModel;
    isNativeToken: boolean;
    isPrivacyToken: boolean;
    constructor({ accountKeySet, tokenId, name, symbol }: NativeTokenParam);
    getAllOutputCoins(tokenId: TokenIdType): Promise<import("../../models/coin").default[]>;
    deriveSerialNumbers(tokenId: TokenIdType): Promise<{
        coins: import("../../models/coin").default[];
        serialNumberList: string[];
    }>;
    /**
     *
     * @param tokenId use `null` for native token
     */
    getAvailableCoins(tokenId?: TokenIdType): Promise<import("../../models/coin").default[]>;
    /**
    *
    * @param tokenId use `null` for native token
    */
    getUnspentCoins(tokenId: TokenIdType): Promise<import("../../models/coin").default[]>;
    /**
     *
     * @param tokenId use `null` for native token
     */
    getAvaiableBalance(tokenId?: TokenIdType): Promise<import("bn.js")>;
    /**
     *
     * @param tokenId use `null` for native token
     */
    getTotalBalance(tokenId?: TokenIdType): Promise<import("bn.js")>;
    getTxHistories(): Promise<import("../../..").TxHistoryModel[]>;
    transfer(paymentInfoList: PaymentInfoModel[], nativeFee?: number, privacyFee?: number): void;
    withdrawNodeReward(): Promise<import("../../..").TxHistoryModel>;
}
export default Token;
//# sourceMappingURL=token.d.ts.map
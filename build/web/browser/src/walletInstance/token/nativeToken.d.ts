import Token from "./token";
import NativeTokenModel from "../../models/token/nativeToken";
import AccountKeySetModel from "../../models/key/accountKeySet";
import PaymentInfoModel from "../../models/paymentInfo";
declare class NativeToken extends Token implements NativeTokenModel {
    tokenId: string;
    name: string;
    symbol: string;
    isNativeToken: boolean;
    constructor(accountKeySet: AccountKeySetModel);
    transfer(paymentInfoList: PaymentInfoModel[], nativeFee: number): Promise<import("../../..").TxHistoryModel>;
    requestStaking(rewardReceiverPaymentAddress: string, nativeFee: number): Promise<import("../../..").TxHistoryModel>;
    pdeContribution(pdeContributionPairID: string, contributedAmount: number, nativeFee: number): Promise<import("../../..").TxHistoryModel>;
    requestTrade(tokenIdBuy: TokenIdType, sellAmount: number, minimumAcceptableAmount: number, nativeFee: number, tradingFee: number): Promise<import("../../..").TxHistoryModel>;
    defragment(defragmentAmount: number, nativeFee: number, maxCoinNumberToDefragment?: number): Promise<import("../../..").TxHistoryModel>;
}
export default NativeToken;
//# sourceMappingURL=nativeToken.d.ts.map
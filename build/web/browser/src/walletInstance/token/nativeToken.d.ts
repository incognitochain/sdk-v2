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
    transfer({ paymentInfoList, nativeFee, memo, txIdHandler, }: {
        paymentInfoList: PaymentInfoModel[];
        nativeFee: string;
        memo?: string;
        txIdHandler?: (txId: string) => void;
    }): Promise<import("../../..").TxHistoryModel>;
    requestStaking(rewardReceiverPaymentAddress: string, nativeFee: string): Promise<import("../../..").TxHistoryModel>;
    pdeContribution(pdeContributionPairID: string, contributedAmount: string, nativeFee: string): Promise<import("../../..").TxHistoryModel>;
    requestTrade(tokenIdBuy: TokenIdType, sellAmount: string, minimumAcceptableAmount: string, nativeFee: string, tradingFee: string): Promise<import("../../..").TxHistoryModel>;
    defragment(defragmentAmount: string, nativeFee: string, maxCoinNumberToDefragment?: number): Promise<import("../../..").TxHistoryModel>;
}
export default NativeToken;
//# sourceMappingURL=nativeToken.d.ts.map
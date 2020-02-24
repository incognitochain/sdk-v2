import Token from './token';
import NativeTokenModel from '@src/models/token/nativeToken';
import AccountKeySetModel from '@src/models/key/accountKeySet';
import PaymentInfoModel from '@src/models/paymentInfo';
declare class NativeToken extends Token implements NativeTokenModel {
    tokenId: string;
    name: string;
    symbol: string;
    isNativeToken: boolean;
    constructor(accountKeySet: AccountKeySetModel);
    transfer(paymentInfoList: PaymentInfoModel[], nativeFee?: number): Promise<import("../../models/txHistory").TxHistoryModel>;
    requestStaking(rewardReceiverPaymentAddress: string, nativeFee: number): Promise<import("../../models/txHistory").TxHistoryModel>;
    pdeContribution(pdeContributionPairID: string, contributedAmount: number, nativeFee: number): Promise<import("../../models/txHistory").TxHistoryModel>;
    requestTrade(tokenIdBuy: TokenIdType, sellAmount: number, minimumAcceptableAmount: number, nativeFee: number, tradingFee: number): Promise<import("../../models/txHistory").TxHistoryModel>;
}
export default NativeToken;
//# sourceMappingURL=nativeToken.d.ts.map
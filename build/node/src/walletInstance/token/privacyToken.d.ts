import Token from "./token";
import PrivacyTokenModel from "../../models/token/privacyToken";
import AccountKeySetModel from "../../models/key/accountKeySet";
import PaymentInfoModel from "../../models/paymentInfo";
interface PrivacyTokenParam {
    tokenId: string;
    name: string;
    symbol: string;
    totalSupply: number;
    accountKeySet: AccountKeySetModel;
}
declare class PrivacyToken extends Token implements PrivacyTokenModel {
    tokenId: string;
    name: string;
    symbol: string;
    isPrivacyToken: boolean;
    totalSupply: number;
    constructor({ accountKeySet, tokenId, name, symbol, totalSupply }: PrivacyTokenParam);
    hasExchangeRate(): Promise<boolean>;
    getNativeAvailableCoins(): Promise<import("../../models/coin").default[]>;
    transfer(paymentList: PaymentInfoModel[], nativeFee: number, privacyFee: number): Promise<import("../../..").TxHistoryModel>;
    burning(outchainAddress: string, burningAmount: number, nativeFee: number, privacyFee: number): Promise<import("../../..").TxHistoryModel>;
    pdeContribution(pdeContributionPairID: string, contributedAmount: number, nativeFee: number, privacyFee: number): Promise<import("../../..").TxHistoryModel>;
    requestTrade(tokenIdBuy: TokenIdType, sellAmount: number, minimumAcceptableAmount: number, nativeFee: number, privacyFee: number, tradingFee: number): Promise<import("../../..").TxHistoryModel>;
}
export default PrivacyToken;
//# sourceMappingURL=privacyToken.d.ts.map
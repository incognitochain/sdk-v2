import Token from "./token";
import PrivacyTokenModel from "../../models/token/privacyToken";
import AccountKeySetModel from "../../models/key/accountKeySet";
import PaymentInfoModel from "../../models/paymentInfo";
import PrivacyTokenApiModel, { BridgeInfoInterface } from "../../models/bridge/privacyTokenApi";
interface PrivacyTokenParam {
    privacyTokenApi: PrivacyTokenApiModel;
    accountKeySet: AccountKeySetModel;
}
declare class PrivacyToken extends Token implements PrivacyTokenModel {
    tokenId: string;
    name: string;
    symbol: string;
    isPrivacyToken: boolean;
    totalSupply: number;
    bridgeInfo: BridgeInfoInterface;
    constructor({ accountKeySet, privacyTokenApi }: PrivacyTokenParam);
    get bridgeErc20Token(): boolean;
    get bridgeEthereum(): boolean;
    hasExchangeRate(): Promise<boolean>;
    getNativeAvailableCoins(): Promise<import("../../models/coin").default[]>;
    transfer(paymentList: PaymentInfoModel[], nativeFee: number, privacyFee: number): Promise<import("../../..").TxHistoryModel>;
    burning(outchainAddress: string, burningAmount: number, nativeFee: number, privacyFee: number): Promise<import("../../..").TxHistoryModel>;
    pdeContribution(pdeContributionPairID: string, contributedAmount: number, nativeFee: number, privacyFee: number): Promise<import("../../..").TxHistoryModel>;
    requestTrade(tokenIdBuy: TokenIdType, sellAmount: number, minimumAcceptableAmount: number, nativeFee: number, privacyFee: number, tradingFee: number): Promise<import("../../..").TxHistoryModel>;
    bridgeGenerateDepositAddress(): Promise<any>;
    bridgeGetHistory(): Promise<any>;
}
export default PrivacyToken;
//# sourceMappingURL=privacyToken.d.ts.map
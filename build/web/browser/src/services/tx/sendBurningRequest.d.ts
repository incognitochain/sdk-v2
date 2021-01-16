import PaymentInfoModel from "../../models/paymentInfo";
import AccountKeySetModel from "../../models/key/accountKeySet";
import CoinModel from "../../models/coin";
interface TokenInfo {
    tokenId: TokenIdType;
    tokenSymbol: TokenSymbolType;
    tokenName: TokenNameType;
}
interface BurnParam extends TokenInfo {
    accountKeySet: AccountKeySetModel;
    nativeAvailableCoins: CoinModel[];
    privacyAvailableCoins: CoinModel[];
    nativeFee: string;
    privacyFee: string;
    outchainAddress: string;
    burningAmount: string;
    subNativePaymentInfoList?: PaymentInfoModel[];
    subPrivacyPaymentInfoList?: PaymentInfoModel[];
    memo?: string;
}
export default function sendBurningRequest({ accountKeySet, nativeAvailableCoins, privacyAvailableCoins, nativeFee, privacyFee, tokenId, tokenSymbol, tokenName, outchainAddress, burningAmount, subNativePaymentInfoList, subPrivacyPaymentInfoList, memo, }: BurnParam): Promise<import("../../..").TxHistoryModel>;
export {};
//# sourceMappingURL=sendBurningRequest.d.ts.map
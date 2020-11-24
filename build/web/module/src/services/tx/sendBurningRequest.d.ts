import AccountKeySetModel from "../../models/key/accountKeySet";
import CoinModel from "../../models/coin";
interface TokenInfo {
    tokenId: TokenIdType;
    tokenSymbol: TokenSymbolType;
    tokenName: TokenNameType;
}
interface SendParam extends TokenInfo {
    accountKeySet: AccountKeySetModel;
    nativeAvailableCoins: CoinModel[];
    privacyAvailableCoins: CoinModel[];
    nativeFee: string;
    privacyFee: string;
    outchainAddress: string;
    burningAmount: string;
}
export default function sendBurningRequest({ accountKeySet, nativeAvailableCoins, privacyAvailableCoins, nativeFee, privacyFee, tokenId, tokenSymbol, tokenName, outchainAddress, burningAmount, }: SendParam): Promise<import("../../..").TxHistoryModel>;
export {};
//# sourceMappingURL=sendBurningRequest.d.ts.map
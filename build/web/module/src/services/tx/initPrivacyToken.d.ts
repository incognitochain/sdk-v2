import AccountKeySetModel from "../../models/key/accountKeySet";
import CoinModel from "../../models/coin";
interface TokenInfo {
    tokenSymbol: TokenSymbolType;
    tokenName: TokenNameType;
}
interface InitParam extends TokenInfo {
    accountKeySet: AccountKeySetModel;
    availableNativeCoins: CoinModel[];
    nativeFee: number;
    supplyAmount: number;
}
export default function initPrivacyToken({ accountKeySet, availableNativeCoins, nativeFee, tokenSymbol, tokenName, supplyAmount }: InitParam): Promise<import("../../..").TxHistoryModel>;
export {};
//# sourceMappingURL=initPrivacyToken.d.ts.map
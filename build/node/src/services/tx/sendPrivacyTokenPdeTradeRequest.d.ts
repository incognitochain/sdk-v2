import AccountKeySetModel from "../../models/key/accountKeySet";
import CoinModel from "../../models/coin";
interface ContributionParam {
    accountKeySet: AccountKeySetModel;
    availableNativeCoins: CoinModel[];
    nativeFee: number;
    tradingFee: number;
    sellAmount: number;
    tokenIdBuy: TokenIdType;
    minimumAcceptableAmount: number;
    privacyAvailableCoins: CoinModel[];
    privacyFee: number;
    tokenId: TokenIdType;
    tokenName: TokenNameType;
    tokenSymbol: TokenSymbolType;
}
export default function sendPrivacyTokenPdeTradeRequest({ accountKeySet, availableNativeCoins, privacyAvailableCoins, tradingFee, sellAmount, minimumAcceptableAmount, nativeFee, privacyFee, tokenId, tokenName, tokenSymbol, tokenIdBuy }: ContributionParam): Promise<import("../../..").TxHistoryModel>;
export {};
//# sourceMappingURL=sendPrivacyTokenPdeTradeRequest.d.ts.map
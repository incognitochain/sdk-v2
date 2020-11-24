import AccountKeySetModel from "../../models/key/accountKeySet";
import CoinModel from "../../models/coin";
interface TradeParam {
    accountKeySet: AccountKeySetModel;
    availableNativeCoins: CoinModel[];
    nativeFee: string;
    tradingFee: string;
    sellAmount: string;
    tokenIdBuy: TokenIdType;
    tokenIdSell: TokenIdType;
    minimumAcceptableAmount: string;
}
export default function sendNativeTokenPdeTradeRequest({ accountKeySet, availableNativeCoins, nativeFee, tradingFee, tokenIdBuy, tokenIdSell, sellAmount, minimumAcceptableAmount }: TradeParam): Promise<import("../../..").TxHistoryModel>;
export {};
//# sourceMappingURL=sendNativeTokenPdeTradeRequest.d.ts.map
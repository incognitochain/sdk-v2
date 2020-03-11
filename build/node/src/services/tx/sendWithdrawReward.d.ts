import AccountKeySetModel from "../../models/key/accountKeySet";
import CoinModel from "../../models/coin";
interface WithdrawRewardParam {
    accountKeySet: AccountKeySetModel;
    availableNativeCoins: CoinModel[];
    tokenId: TokenIdType;
}
export default function sendWithdrawReward({ accountKeySet, availableNativeCoins, tokenId }: WithdrawRewardParam): Promise<import("../../..").TxHistoryModel>;
export {};
//# sourceMappingURL=sendWithdrawReward.d.ts.map
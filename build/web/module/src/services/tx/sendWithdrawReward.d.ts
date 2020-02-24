import AccountKeySetModel from '@src/models/key/accountKeySet';
import CoinModel from '@src/models/coin';
interface WithdrawRewardParam {
    accountKeySet: AccountKeySetModel;
    availableNativeCoins: CoinModel[];
    tokenId: TokenIdType;
}
export default function sendWithdrawReward({ accountKeySet, availableNativeCoins, tokenId }: WithdrawRewardParam): Promise<import("../../models/txHistory").TxHistoryModel>;
export {};
//# sourceMappingURL=sendWithdrawReward.d.ts.map
import AccountKeySetModel from '@src/models/key/accountKeySet';
import CoinModel from '@src/models/coin';
interface ContributionParam {
    accountKeySet: AccountKeySetModel;
    availableNativeCoins: CoinModel[];
    nativeFee: number;
    pdeContributionPairID: string;
    contributedAmount: number;
    tokenId: TokenIdType;
}
export default function sendNativeTokenPdeContribution({ accountKeySet, availableNativeCoins, nativeFee, pdeContributionPairID, tokenId, contributedAmount, }: ContributionParam): Promise<import("../../models/txHistory").TxHistoryModel>;
export {};
//# sourceMappingURL=sendNativeTokenPdeContribution.d.ts.map
import AccountKeySetModel from "../../models/key/accountKeySet";
import CoinModel from "../../models/coin";
interface ContributionParam {
    accountKeySet: AccountKeySetModel;
    availableNativeCoins: CoinModel[];
    nativeFee: number;
    pdeContributionPairID: string;
    contributedAmount: number;
    tokenId: TokenIdType;
}
export default function sendNativeTokenPdeContribution({ accountKeySet, availableNativeCoins, nativeFee, pdeContributionPairID, tokenId, contributedAmount, }: ContributionParam): Promise<import("../../..").TxHistoryModel>;
export {};
//# sourceMappingURL=sendNativeTokenPdeContribution.d.ts.map
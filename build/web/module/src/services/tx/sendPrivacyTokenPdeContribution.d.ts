import AccountKeySetModel from "../../models/key/accountKeySet";
import CoinModel from "../../models/coin";
interface ContributionParam {
    accountKeySet: AccountKeySetModel;
    availableNativeCoins: CoinModel[];
    privacyAvailableCoins: CoinModel[];
    nativeFee: string;
    privacyFee: string;
    pdeContributionPairID: string;
    contributedAmount: string;
    tokenId: TokenIdType;
    tokenName: TokenNameType;
    tokenSymbol: TokenSymbolType;
}
export default function sendPrivacyTokenPdeContribution({ accountKeySet, availableNativeCoins, privacyAvailableCoins, nativeFee, privacyFee, pdeContributionPairID, tokenId, tokenName, tokenSymbol, contributedAmount, }: ContributionParam): Promise<import("../../..").TxHistoryModel>;
export {};
//# sourceMappingURL=sendPrivacyTokenPdeContribution.d.ts.map
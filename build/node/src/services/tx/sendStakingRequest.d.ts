import AccountKeySetModel from '@src/models/key/accountKeySet';
import CoinModel from '@src/models/coin';
interface StakingParam {
    candidateAccountKeySet: AccountKeySetModel;
    rewardReceiverPaymentAddress: string;
    availableNativeCoins: CoinModel[];
    nativeFee: number;
    autoReStaking: boolean;
}
export default function sendStakingRequest({ candidateAccountKeySet, rewardReceiverPaymentAddress, availableNativeCoins, nativeFee, autoReStaking }: StakingParam): Promise<import("../../models/txHistory").TxHistoryModel>;
export {};
//# sourceMappingURL=sendStakingRequest.d.ts.map
import AccountKeySetModel from "../../models/key/accountKeySet";
import CoinModel from "../../models/coin";
interface StakingParam {
    candidateAccountKeySet: AccountKeySetModel;
    rewardReceiverPaymentAddress: string;
    availableNativeCoins: CoinModel[];
    nativeFee: number;
    autoReStaking: boolean;
}
export default function sendStakingRequest({ candidateAccountKeySet, rewardReceiverPaymentAddress, availableNativeCoins, nativeFee, autoReStaking }: StakingParam): Promise<import("../../..").TxHistoryModel>;
export {};
//# sourceMappingURL=sendStakingRequest.d.ts.map
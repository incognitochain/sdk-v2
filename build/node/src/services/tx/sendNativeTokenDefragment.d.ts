import AccountKeySetModel from "../../models/key/accountKeySet";
import CoinModel from "../../models/coin";
interface DefragmentParam {
    accountKeySet: AccountKeySetModel;
    availableNativeCoins: CoinModel[];
    nativeFee: number;
    defragmentAmount: number;
    maxCoinNumber: number;
}
export default function sendNativeTokenDefragment({ accountKeySet, availableNativeCoins, nativeFee, defragmentAmount, maxCoinNumber }: DefragmentParam): Promise<import("../../..").TxHistoryModel>;
export {};
//# sourceMappingURL=sendNativeTokenDefragment.d.ts.map
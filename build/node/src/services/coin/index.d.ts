import bn from 'bn.js';
import CoinModel from "../../models/coin";
import AccountKeySetModel from "../../models/key/accountKeySet";
/** getAllOutputCoins returns all output coins with tokenID, for native token: tokenId is null
   *
   */
export declare function getAllOutputCoins(accountKeySet: AccountKeySetModel, tokenId: string): Promise<CoinModel[]>;
/**
 * deriveSerialNumbers returns list of serial numbers of input coins
   *
   */
export declare function deriveSerialNumbers(accountKeySet: AccountKeySetModel, coins?: CoinModel[]): Promise<{
    coins: CoinModel[];
    serialNumberList: string[];
}>;
export declare function getValueFromCoins(coins: CoinModel[]): bn;
export declare function chooseBestCoinToSpent(coins: CoinModel[], amountBN: bn): {
    resultInputCoins: CoinModel[];
    remainInputCoins: CoinModel[];
    totalResultInputCoinAmount: bn;
};
//# sourceMappingURL=index.d.ts.map
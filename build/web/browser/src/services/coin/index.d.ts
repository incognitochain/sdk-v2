import bn from 'bn.js';
import CoinModel from "../../models/coin";
import AccountKeySetModel from "../../models/key/accountKeySet";
/** getAllOutputCoins returns all output coins with tokenID, for native token: tokenId is null
 * Get total bill of account by payment + readonly key (include spend, unspent and spending)
 * =>
 * + Total balance
 * +
 */
export declare function getAllOutputCoins(accountKeySet: AccountKeySetModel, tokenId: string): Promise<CoinModel[]>;
/**
 * deriveSerialNumbers returns list of serial numbers of input coins
 * Combine with all bills + private key => get all serial number of bills
 * (get serial number of a bill)
 */
export declare function deriveSerialNumbers(accountKeySet: AccountKeySetModel, coins?: CoinModel[]): Promise<{
    coins: CoinModel[];
    serialNumberList: string[];
}>;
export declare function getValueFromCoins(coins: CoinModel[]): bn;
export declare function chooseCoinToDefragment(coins: CoinModel[], defragmentAmount: bn, maxCoinNumber?: number): CoinModel[];
export declare function chooseBestCoinToSpent(coins: CoinModel[], amountBN: bn): {
    resultInputCoins: CoinModel[];
    remainInputCoins: CoinModel[];
    totalResultInputCoinAmount: bn;
};
//# sourceMappingURL=index.d.ts.map
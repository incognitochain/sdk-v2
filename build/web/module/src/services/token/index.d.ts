/// <reference types="bn.js" />
import AccountKeySetModel from '@src/models/key/accountKeySet';
import CoinModel from '@src/models/coin';
/**
 * Return list of coins that not existed in chain (not use yet)
 */
export declare function getUnspentCoins(accountKeySet: AccountKeySetModel, tokenId: string): Promise<CoinModel[]>;
/**
 * Coins can use to create tx (excluding spent coins, spending coins)
 */
export declare function getAvailableCoins(accountKeySet: AccountKeySetModel, tokenId: string, isNativeCoin: boolean): Promise<CoinModel[]>;
/**
 * List of serial numbers are being use
 */
export declare function getSpendingSerialCoins(): Promise<{
    spendingNativeSerialNumbers: string[];
    spendingPrivacySerialNumbers: string[];
}>;
export declare function getTotalBalance(unspentCoins: CoinModel[]): import("bn.js");
export declare function getAvailableBalance(availableCoins: CoinModel[]): import("bn.js");
export declare function hasExchangeRate(tokenId: string): Promise<boolean>;
//# sourceMappingURL=index.d.ts.map
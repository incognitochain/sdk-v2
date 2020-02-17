import { getAllOutputCoins, getUnspentCoins, deriveSerialNumbers } from '@src/services/coin';
import AccountKeySetModel from '@src/models/key/accountKeySet';
import CoinModel from '@src/models/coin';

class TokenService {
  constructor() {}

  /**
   * Result coins will not have their serial number, need to derive Serial Number to get it
   */
  async getAllOutputCoins(accountKeySet: AccountKeySetModel, tokenId: string) {
    return await getAllOutputCoins(accountKeySet, tokenId);
  }

  /**
   * Get serial number for coins
   */
  async deriveSerialNumberForCoins(accountKeySet: AccountKeySetModel, coinsToDerive: CoinModel[]) {
    return await deriveSerialNumbers(accountKeySet, coinsToDerive);
  }

  async getUnspentCoins(accountKeySet: AccountKeySetModel, derivedCoins: CoinModel[], tokenId: string) {
    const unspentCoins = await getUnspentCoins(accountKeySet, derivedCoins, tokenId);

    return unspentCoins;
  }

  async getSpendingCoinSerialNumber() : Promise<string[]> {
    return [];
  }

  /**
   * Coins can use to create tx (excluding spent coins, spending coins)
   */
  async getAvailableCoins(accountKeySet: AccountKeySetModel, tokenId: string) {
    const allCoins = await this.getAllOutputCoins(accountKeySet, tokenId);
    const derivedCoins = await this.deriveSerialNumberForCoins(accountKeySet, allCoins);
    const unspentCoins = this.getUnspentCoins(accountKeySet, derivedCoins.coins, tokenId);

    //TODO: need to filter spending coins

    return unspentCoins;
  }

  async getTotalBalance(unspentCoins: CoinModel[]) {
    return unspentCoins?.reduce((balance, coin) => Number.parseInt(coin.value) + balance, 0) || 0;
  }
}

export default TokenService;
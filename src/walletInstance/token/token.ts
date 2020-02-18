import { getAllOutputCoins, getUnspentCoins, deriveSerialNumbers } from '@src/services/coin';
import BaseTokenModel from '@src/models/token/baseToken';
import AccountModel from '@src/models/account/account';
import AccountKeySetModel from '@src/models/key/accountKeySet';

interface NativeTokenParam {
  tokenId: string,
  name: string,
  symbol: string,
  accountKeySet: AccountKeySetModel
};


class Token implements BaseTokenModel {
  tokenId: string;
  name: string;
  symbol: string;
  accountKeySet: AccountKeySetModel;

  constructor({ accountKeySet, tokenId, name, symbol }: NativeTokenParam) {
    this.accountKeySet = accountKeySet;
    this.tokenId = String(tokenId || '').toLowerCase();
    this.name = name;
    this.symbol = symbol;
  }

  async getAllOutputCoins(tokenId: TokenIdType) {
    return await getAllOutputCoins(this.accountKeySet, tokenId);
  }

  async deriveSerialNumbers(tokenId: TokenIdType) {
    const allCoins = await this.getAllOutputCoins(tokenId);

    // return { serialNumberList, coins }
    return await deriveSerialNumbers(this.accountKeySet, allCoins);
  }

  async getUnspentCoins(tokenId: TokenIdType) {
    const serialData = await this.deriveSerialNumbers(tokenId);

    const { coins } = serialData || {};

    const unspentCoins = await getUnspentCoins(this.accountKeySet, coins, tokenId);

    return unspentCoins;
  }

  async getSpendingCoinSerialNumber() : Promise<string[]> {
    return [];
  }

   /**
   * 
   * @param tokenId use `null` for native token
   */
  async getAvailableCoins(tokenId: TokenIdType = this.tokenId) {
    const unspentCoins = await this.getUnspentCoins(tokenId);
    const spendingSerialNumbers = await this.getSpendingCoinSerialNumber();

    return unspentCoins?.filter(coin => !spendingSerialNumbers.includes(coin.serialNumber));
  }

  /**
   * 
   * @param tokenId use `null` for native token
   */
  async getTotalBalance(tokenId: TokenIdType = this.tokenId) {
    const unspentCoins = await this.getUnspentCoins(tokenId);

    return unspentCoins?.reduce((balance, coin) => Number.parseInt(coin.value) + balance, 0) || 0;
  }

  getAvaiableBalance() {}

  transfer() {}
}

export default Token;
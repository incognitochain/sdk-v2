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

  async getAllOutputCoins() {
    return await getAllOutputCoins(this.accountKeySet, this.tokenId);
  }

  async deriveSerialNumbers() {
    const allCoins = await this.getAllOutputCoins();

    // return { serialNumberList, coins }
    return await deriveSerialNumbers(this.accountKeySet, allCoins);
  }

  async getUnspentCoins() {
    const serialData = await this.deriveSerialNumbers();

    const { coins } = serialData || {};

    const unspentCoins = await getUnspentCoins(this.accountKeySet, coins, this.tokenId);

    return unspentCoins;
  }

  async getSpendingCoinSerialNumber() : Promise<string[]> {
    return [];
  }

  async getAvailableCoins() {
    const unspentCoins = await this.getUnspentCoins();
    const spendingSerialNumbers = await this.getSpendingCoinSerialNumber();

    return unspentCoins?.filter(coin => !spendingSerialNumbers.includes(coin.serialNumber));
  }

  async getTotalBalance() {
    const unspentCoins = await this.getUnspentCoins();

    return unspentCoins?.reduce((balance, coin) => Number.parseInt(coin.value) + balance, 0) || 0;
  }

  getAvaiableBalance() {}

  transfer() {}
}

export default Token;
import { getAllOutputCoins, getUnspentCoins, deriveSerialNumbers } from '@src/services/coin';

class Token {
  constructor({ account, tokenId, name, symbol }) {
    this.account = account;
    this.tokenId = String(tokenId || '').toLowerCase();
    this.name = name;
    this.symbol = symbol;
  }

  async getAllOutputCoins() {
    return await getAllOutputCoins(this.account, this.tokenId);
  }

  async deriveSerialNumbers() {
    const allCoins = await this.getAllOutputCoins();

    // return { serialNumberList, coins }
    return await deriveSerialNumbers(this.account.serializeKey.privateKey, allCoins);
  }

  async getUnspentCoins() {
    const serialData = await this.deriveSerialNumbers();

    const { coins } = serialData || {};

    const unspentCoins = await getUnspentCoins(this.account.serializeKey.paymentAddress, coins, this.tokenId);

    return unspentCoins;
  }

  getSpendingCoinSerialNumber() {
    return [];
  }

  async getAvailableCoins() {
    const unspentCoins = await this.getUnspentCoins();
    const spendingCoinSerialNumbers = await this.getSpendingCoinSerialNumber();
    const spendingSerialNumbers = spendingCoinSerialNumbers?.map(coin => coin.SerialNumber);

    return unspentCoins?.filter(coin => !spendingSerialNumbers.includes(coin.SerialNumber));
  }

  async getTotalBalance() {
    const unspentCoins = await this.getUnspentCoins();

    return unspentCoins?.reduce((balance, coin) => Number.parseInt(coin.Value) + balance, 0) || 0;
  }

  getAvaiableBalance() {}

  transfer() {}
}

export default Token;
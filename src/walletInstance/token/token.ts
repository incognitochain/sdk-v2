import { getAllOutputCoins, deriveSerialNumbers } from '@src/services/coin';
import BaseTokenModel from '@src/models/token/baseToken';
import AccountKeySetModel from '@src/models/key/accountKeySet';
import { getTotalBalance, getUnspentCoins, getAvailableCoins, getAvailableBalance } from '@src/services/token';
import { getTxHistoryByPublicKey } from '@src/services/history/txHistory';
import PaymentInfoModel from '@src/models/paymentInfo';

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
  isNativeToken: boolean;
  isPrivacyToken: boolean;

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

  /**
   * 
   * @param tokenId use `null` for native token
   */
  async getAvailableCoins(tokenId: TokenIdType = this.tokenId) {
    return getAvailableCoins(this.accountKeySet, tokenId, this.isNativeToken);
  }

   /**
   * 
   * @param tokenId use `null` for native token
   */
  async getUnspentCoins(tokenId: TokenIdType) {
    return getUnspentCoins(this.accountKeySet, tokenId);
  }

  /**
   * 
   * @param tokenId use `null` for native token
   */
  async getAvaiableBalance(tokenId: TokenIdType = this.tokenId) {
    const availableCoins = await this.getAvailableCoins(tokenId);
    return getAvailableBalance(availableCoins);
  }

  /**
   * 
   * @param tokenId use `null` for native token
   */
  async getTotalBalance(tokenId: TokenIdType = this.tokenId) {
    const unspentCoins = await this.getUnspentCoins(tokenId);
    return getTotalBalance(unspentCoins);
  }

  async getTxHistories() {
    const sentTx = await getTxHistoryByPublicKey(this.accountKeySet.publicKeySerialized, this.isPrivacyToken ? this.tokenId : null);
    return sentTx;
  }

  transfer(paymentInfoList: PaymentInfoModel[], nativeFee?: number, privacyFee?: number) {}
}

export default Token;
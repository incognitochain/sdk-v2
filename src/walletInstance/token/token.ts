import rpc from '@src/services/rpc';
import { getAllOutputCoins, deriveSerialNumbers } from '@src/services/coin';
import BaseTokenModel from '@src/models/token/baseToken';
import AccountKeySetModel from '@src/models/key/accountKeySet';
import {
  getTotalBalance,
  getUnspentCoins,
  getAvailableCoins,
  getAvailableBalance,
} from '@src/services/token';
import { getTxHistoryByPublicKey } from '@src/services/history/txHistory';
import PaymentInfoModel from '@src/models/paymentInfo';
import sendWithdrawReward from '@src/services/tx/sendWithdrawReward';
import Validator from '@src/utils/validator';

interface NativeTokenParam {
  tokenId: string;
  name: string;
  symbol: string;
  accountKeySet: AccountKeySetModel;
}

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
    new Validator('tokenId', tokenId).string();

    return await getAllOutputCoins(this.accountKeySet, tokenId);
  }

  async deriveSerialNumbers(tokenId: TokenIdType) {
    new Validator('tokenId', tokenId).string();

    const allCoins = await this.getAllOutputCoins(tokenId);

    // return { serialNumberList, coins }
    return await deriveSerialNumbers(this.accountKeySet, allCoins);
  }

  /**
   *
   * @param tokenId use `null` for native token
   */
  async getAvailableCoins(tokenId: TokenIdType = this.tokenId) {
    new Validator('tokenId', tokenId).string();
    return getAvailableCoins(this.accountKeySet, tokenId, this.isNativeToken);
  }

  /**
   *
   * @param tokenId use `null` for native token
   */
  async getUnspentCoins(tokenId: TokenIdType) {
    new Validator('tokenId', tokenId).string();

    return getUnspentCoins(this.accountKeySet, tokenId);
  }

  /**
   *
   * @param tokenId use `null` for native token
   */
  async getAvaiableBalance(tokenId: TokenIdType = this.tokenId) {
    new Validator('tokenId', tokenId).string();

    const availableCoins = await this.getAvailableCoins(tokenId);
    const balanceBN = await getAvailableBalance(availableCoins);

    L.info(
      `Token ${this.tokenId} load available balance = ${balanceBN.toNumber()}`
    );

    return balanceBN;
  }

  /**
   *
   * @param tokenId use `null` for native token
   */
  async getTotalBalance(tokenId: TokenIdType = this.tokenId) {
    new Validator('tokenId', tokenId).string();

    const unspentCoins = await this.getUnspentCoins(tokenId);
    const balanceBN = await getTotalBalance(unspentCoins);

    L.info(
      `Token ${this.tokenId} load total balance = ${balanceBN.toString()}`
    );

    return balanceBN.toString();
  }

  async getTxHistories() {
    const sentTx = await getTxHistoryByPublicKey(
      this.accountKeySet.publicKeySerialized,
      this.isPrivacyToken ? this.tokenId : null
    );
    return sentTx;
  }

  getTransactionByReceiver = ({
    skip,
    limit,
  }: {
    skip: number;
    limit: number;
  }) =>
    rpc.getTransactionByReceiverV2({
      PaymentAddress: this.accountKeySet.paymentAddressKeySerialized,
      ReadonlyKey: this.accountKeySet.viewingKeySerialized,
      TokenID: this.tokenId,
      Skip: skip,
      Limit: limit,
    });

  transfer({
    paymentInfoList,
    nativeFee,
    privacyFee,
    memo,
  }: {
    paymentInfoList: PaymentInfoModel[];
    nativeFee?: string;
    privacyFee?: string;
    memo?: string;
  }) {}

  async withdrawNodeReward() {
    try {
      const history = await sendWithdrawReward({
        accountKeySet: this.accountKeySet,
        availableNativeCoins: await this.getAvailableCoins(),
        tokenId: this.tokenId,
      });

      L.info(
        `Token ${this.tokenId} send withdraw node reward request successfully with tx id ${history.txId}`
      );

      return history;
    } catch (e) {
      L.error(`Token ${this.tokenId} sent withdraw node reward failed`, e);
      throw e;
    }
  }
}

export default Token;

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
import { http } from "@src/services/http";

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
  contractId?: string;

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

  async depositTrade({
    depositAmount,
    depositFee,
    depositFeeTokenId,
    paymentAddress,
    priority
  }: {
    depositAmount: number;
    depositFee: number;
    depositFeeTokenId: string;
    paymentAddress: string;
    priority: string;
  }): Promise<any> {
    new Validator('depositAmount', depositAmount).required().number();
    new Validator('depositFee', depositFee).required().number();
    new Validator('depositFeeTokenId', depositFeeTokenId).required().string();
    new Validator('paymentAddress', paymentAddress).required().string();
    new Validator('priority', priority).required().string();

    return http.post('pdefi/request-deposit', {
      'TokenID': this.tokenId,
      'Amount': Math.floor(depositAmount),
      'NetworkFee': Math.floor(depositFee),
      'NetworkFeeTokenID': depositFeeTokenId,
      'ReceiverAddress': paymentAddress,
      'Type': 1,
      'FeeLevel': priority ? priority.toLowerCase() : 'MEDIUM'
    }).then(data => data);
  }

  calculateFee({
    tokenFee,
    prvFee,
    isAddTradingFee,
    tradingFee = 0
  }: {
    tokenFee: number,
    prvFee: number,
    isAddTradingFee: boolean,
    tradingFee?: number
  }) {
    new Validator('tokenFee', tokenFee).required().number();
    new Validator('prvFee', prvFee).required().number();
    const MAX_PDEX_TRADE_STEPS = 4;
    let serverFee = (tokenFee / MAX_PDEX_TRADE_STEPS) * (MAX_PDEX_TRADE_STEPS - 1);
    if (isAddTradingFee) serverFee += tradingFee;
    const tokenNetworkFee = tokenFee / MAX_PDEX_TRADE_STEPS;
    const prvNetworkFee = prvFee / MAX_PDEX_TRADE_STEPS;
    let prvAmount = (prvFee / MAX_PDEX_TRADE_STEPS) * (MAX_PDEX_TRADE_STEPS - 1) + tradingFee;
    return {
      tokenNetworkFee,
      prvNetworkFee,
      prvAmount,
      serverFee
    };
  }

  tradeAPI({
    depositId,
    tradingFee,
    buyTokenId,
    buyAmount,
  }: {
    depositId: number;
    tradingFee?: number,
    buyTokenId: string,
    buyAmount: number,
  }) {
    new Validator('depositId', depositId).required().number();
    new Validator('buyTokenId', buyTokenId).required().string();
    new Validator('buyAmount', buyAmount).required().number();
    return http.post('pdefi/request-pdex-trade', {
      'DepositID': depositId,
      'TradingFee': Math.floor(tradingFee || 0),
      'BuyTokenID': buyTokenId,
      'BuyAmount': Math.floor(buyAmount),
      'MinimumAmount': Math.floor(buyAmount),
      'BuyExpectedAmount': Math.floor(buyAmount),
    });
  };

  // async trade({
  //   tradeAmount,
  //   protocol,
  //   networkFee,
  //   networkFeeId,
  //   tradingFee,
  //   minimumReceiveAmount
  // }: {
  //   tradeAmount: number; // inputValue
  //   protocol?: string; // PDex | kyber | uniswap,
  //   networkFee: number,
  //   networkFeeId: string;
  //   tradingFee?: number
  //   minimumReceiveAmount: number
  // }): Promise<any> {}
}

export default Token;

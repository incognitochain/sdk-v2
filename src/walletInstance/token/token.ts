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
import BigNumber from 'bignumber.js';

interface NativeTokenParam {
  tokenId: string;
  name: string;
  symbol: string;
  accountKeySet: AccountKeySetModel;
}

interface IPriorityList {
  key: string;
  tradingFee: number;
  number: number;
  gasPrice: number;
}

interface PriorityList {
  MEDIUM: IPriorityList;
  FAST: IPriorityList;
  FASTEST: IPriorityList;
}

export interface IQuote {
  maxAmountOut: number;
  maxAmountIn: number;
  expectAmount: string;
  protocol: string;
  dAppAddress: string;
  priorityList: PriorityList;
  network: string;
  crossTrade: boolean;
}

class Token implements BaseTokenModel {
  tokenId: string;
  name: string;
  symbol: string;
  accountKeySet: AccountKeySetModel;
  isNativeToken: boolean;
  isPrivacyToken: boolean;
  tokenAddress?: string;
  pDecimals?: number;
  decimals?: number;

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
    priority,
    type,
  }: {
    depositAmount: number;
    depositFee: number;
    depositFeeTokenId: string;
    paymentAddress: string;
    priority: string;
    type: number;
  }): Promise<any> {
    new Validator('depositAmount', depositAmount).required().number();
    new Validator('depositFee', depositFee).required().number();
    new Validator('depositFeeTokenId', depositFeeTokenId).required().string();
    new Validator('paymentAddress', paymentAddress).required().string();
    new Validator('priority', priority).required().string();
    new Validator('type', type).required().number();

    L.info(`Deposit with TokenID: ${this.tokenId} and Amount: ${Math.floor(depositAmount)} NetworkFee: ${Math.floor(depositFee)} NetworkFeeTokenID ${depositFeeTokenId} ReceiverAddress ${paymentAddress} Type ${type} FeeLevel ${priority ? priority.toLowerCase() : 'MEDIUM'}`)

    return http.post('pdefi/request-deposit', {
      'TokenID': this.tokenId,
      'Amount': Math.floor(depositAmount),
      'NetworkFee': Math.floor(depositFee),
      'NetworkFeeTokenID': depositFeeTokenId,
      'ReceiverAddress': paymentAddress,
      'Type': type,
      'FeeLevel': priority ? priority.toLowerCase() : 'MEDIUM'
    }).then(data => data)
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
    let depositNetworkFee = (tokenFee / MAX_PDEX_TRADE_STEPS) * (MAX_PDEX_TRADE_STEPS - 1);
    if (isAddTradingFee) serverFee += tradingFee;
    const tokenNetworkFee = tokenFee / MAX_PDEX_TRADE_STEPS;
    const prvNetworkFee = prvFee / MAX_PDEX_TRADE_STEPS;
    let prvAmount = (prvFee / MAX_PDEX_TRADE_STEPS) * (MAX_PDEX_TRADE_STEPS - 1) + tradingFee;
    return {
      tokenNetworkFee,
      prvNetworkFee,
      prvAmount,
      serverFee,
      depositNetworkFee
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

  toDecimals({ number }: { number: number }) {
    return new BigNumber(number)
        .dividedBy(new BigNumber(10).pow(this.pDecimals || 0))
        .multipliedBy(new BigNumber(10).pow(this.decimals || 0))
        .dividedToIntegerBy(1)
        .toFixed(0);
  };

  async tradeKyber({
    depositId,
    buyAmount,
    quote,
    slippage,
    buyTokenAddress,
    priority,
    tradingFee
  }: {
    depositId: string;
    buyAmount: number;
    quote: IQuote;
    slippage: number;
    buyTokenAddress: string;
    priority: string;
    tradingFee: number
  }) {

    new Validator('depositId', depositId).required().number();
    new Validator('buyAmount', buyAmount).required().number();
    new Validator('slippage', slippage).required().number();
    new Validator('buyTokenAddress', buyTokenAddress).required().string();
    new Validator('priority', priority).required().string();
    new Validator('tradingFee', tradingFee).required().number();

    const buyAmountDecimals = this.toDecimals({ number: buyAmount });

    const slippagePercent = (100 - slippage) / 100;
    const expectReceiveAmount  = new BigNumber(quote?.expectAmount || '0')
        .multipliedBy(slippagePercent)
        .integerValue(BigNumber.ROUND_FLOOR)
        .toFixed();

    const maxReceiveAmount = new BigNumber(quote?.maxAmountOut || '0')
        .multipliedBy(slippagePercent)
        .integerValue(BigNumber.ROUND_FLOOR)
        .toNumber();

    return http.post('/uniswap/execute', {
      SrcTokens: this.tokenAddress,
      SrcQties: buyAmountDecimals,
      DestTokens: buyTokenAddress,
      DappAddress: quote?.dAppAddress,
      DepositId: depositId,
      ExpectAmount: expectReceiveAmount,
      MaxAmountOut: maxReceiveAmount,
      Fee: tradingFee,
      FeeLevel: priority.toLowerCase()
    })
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

import { TokenInfo } from '@src/constants';
import Token from './token';
import NativeTokenModel from '@src/models/token/nativeToken';
import AccountKeySetModel from '@src/models/key/accountKeySet';
import sendNativeToken from '@src/services/tx/sendNativeToken';
import PaymentInfoModel from '@src/models/paymentInfo';
import sendStakingRequest from '@src/services/tx/sendStakingRequest';
import sendNativeTokenPdeContribution from '@src/services/tx/sendNativeTokenPdeContribution';
import sendNativeTokenPdeTradeRequest from '@src/services/tx/sendNativeTokenPdeTradeRequest';
import Validator from '@src/utils/validator';
import sendNativeTokenDefragment from '@src/services/tx/sendNativeTokenDefragment';
import storage from "@src/services/storage";
import KEYS from "@src/constants/keys";

class NativeToken extends Token implements NativeTokenModel {
  tokenId: string;
  name: string;
  symbol: string;
  isNativeToken: boolean;

  constructor(accountKeySet: AccountKeySetModel) {
    new Validator('accountKeySet', accountKeySet).required();

    super({ accountKeySet, tokenId: null, name: null, symbol: null });

    this.tokenId = TokenInfo.NATIVE_TOKEN.tokenId;
    this.name = TokenInfo.NATIVE_TOKEN.name;
    this.symbol = TokenInfo.NATIVE_TOKEN.symbol;
    this.isNativeToken = true;
  }

  async transfer({
    paymentInfoList,
    nativeFee,
    memo,
    txIdHandler,
  }: {
    paymentInfoList: PaymentInfoModel[];
    nativeFee: string;
    memo?: string;
    txIdHandler?: (txId: string) => void;
  }) {
    try {
      new Validator('paymentInfoList', paymentInfoList)
        .required()
        .paymentInfoList();
      new Validator('nativeFee', nativeFee).required().amount();
      new Validator('memo', nativeFee).string();
      L.info('Native token transfer', { paymentInfoList, nativeFee, memo });
      const history = await sendNativeToken({
        nativePaymentInfoList: paymentInfoList, // list payment info receiver
        nativeFee: nativeFee, // fee send tx
        accountKeySet: this.accountKeySet, // all key of account
        availableCoins: await this.getAvailableCoins(), //available bills (unspent)
        memo, // memo field
        txIdHandler,
      });
      L.info(`Native token transfered successfully with tx id ${history.txId}`);
      return history;
    } catch (e) {
      L.error('Native token transfer failed', e);
      throw e;
    }
  }

  async requestStaking(
    rewardReceiverPaymentAddress: string,
    nativeFee: string
  ) {
    try {
      new Validator(
        'rewardReceiverPaymentAddress',
        rewardReceiverPaymentAddress
      )
        .required()
        .string();
      new Validator('nativeFee', nativeFee).required().amount();

      L.info('Native token request staking', {
        rewardReceiverPaymentAddress,
        nativeFee,
      });

      const history = await sendStakingRequest({
        candidateAccountKeySet: this.accountKeySet,
        availableNativeCoins: await this.getAvailableCoins(),
        nativeFee,
        rewardReceiverPaymentAddress,
        autoReStaking: true,
      });

      L.info(
        `Native token sent request staking successfully with tx id ${history.txId}`
      );

      return history;
    } catch (e) {
      L.error('Native send request staking failed', e);
      throw e;
    }
  }

  async pdeContribution(
    pdeContributionPairID: string,
    contributedAmount: string,
    nativeFee: string
  ) {
    try {
      new Validator('pdeContributionPairID', pdeContributionPairID)
        .required()
        .string();
      new Validator('contributedAmount', contributedAmount).required().amount();
      new Validator('nativeFee', nativeFee).required().amount();

      L.info('Native token sent PDE contribution', {
        pdeContributionPairID,
        contributedAmount,
        nativeFee,
      });

      const history = await sendNativeTokenPdeContribution({
        accountKeySet: this.accountKeySet,
        availableNativeCoins: await this.getAvailableCoins(),
        nativeFee,
        pdeContributionPairID,
        tokenId: this.tokenId,
        contributedAmount,
      });

      L.info(
        `Native token sent PDE contribution successfully with tx id ${history.txId}`
      );

      return history;
    } catch (e) {
      L.error('Native token sent PDE contribution failed', e);
      throw e;
    }
  }

  async requestTrade(
    tokenIdBuy: TokenIdType,
    sellAmount: string,
    minimumAcceptableAmount: string,
    nativeFee: string,
    tradingFee: string
  ) {
    try {
      new Validator('tokenIdBuy', tokenIdBuy).required().string();
      new Validator('sellAmount', sellAmount).required().amount();
      new Validator('minimumAcceptableAmount', minimumAcceptableAmount)
        .required()
        .amount();
      new Validator('nativeFee', nativeFee).required().amount();
      new Validator('tradingFee', tradingFee).required().amount();

      L.info('Native token send trade request', {
        tokenIdBuy,
        sellAmount,
        minimumAcceptableAmount,
        nativeFee,
        tradingFee,
      });

      const history = await sendNativeTokenPdeTradeRequest({
        accountKeySet: this.accountKeySet,
        availableNativeCoins: await this.getAvailableCoins(),
        nativeFee,
        tradingFee,
        tokenIdBuy,
        tokenIdSell: this.tokenId,
        sellAmount,
        minimumAcceptableAmount,
      });

      L.info(
        `Native token sent trade request successfully with tx id ${history.txId}`
      );

      return history;
    } catch (e) {
      L.error('Native token sent trade request failed', e);
      throw e;
    }
  }

  async defragment(
    defragmentAmount: string,
    nativeFee: string,
    maxCoinNumberToDefragment?: number
  ) {
    try {
      new Validator('defragmentAmount', defragmentAmount).required().amount();
      new Validator('nativeFee', nativeFee).required().amount();

      L.info('Native token defragment', { defragmentAmount, nativeFee });

      const history = await sendNativeTokenDefragment({
        defragmentAmount,
        nativeFee: nativeFee,
        accountKeySet: this.accountKeySet,
        availableNativeCoins: await this.getAvailableCoins(),
        maxCoinNumber: maxCoinNumberToDefragment,
      });

      if (history) {
        L.info(
          `Native token defragmented successfully with tx id ${history.txId}`
        );
      } else {
        L.info('Not much coins need to defragment');
      }

      return history;
    } catch (e) {
      L.error('Native token defragmented failed', e);
      throw e;
    }
  }

  async trade({
    tradeAmount,
    networkFee,
    tradingFee,
    buyAmount,
    buyTokenId,
    paymentAddress,
    priority
  }: {
    tradeAmount: number; // inputValue

    networkFee: number;
    tradingFee: number;

    buyAmount: number,
    buyTokenId: string;
    paymentAddress: string;
    priority?: string; // default is medium
  }) {
    try {
      const prvFee = networkFee;
      const tokenFee = networkFee;

      const {
        tokenNetworkFee,
        prvNetworkFee,
        prvAmount,
        serverFee
      } = this.calculateFee({ tokenFee, prvFee, isAddTradingFee: true, tradingFee });

      L.info(`About Fee prvFee: ${prvFee} tokenFee: ${tokenFee} tradingFee: ${tradingFee} tokenNetworkFee: ${tokenNetworkFee} prvNetworkFee: ${prvNetworkFee} prvAmount: ${prvAmount} serverFee: ${serverFee}`);

      /** Step 1: deposit  */
      const { DepositID: depositId, WalletAddress: walletAddress } = await this.depositTrade({
        depositAmount: tradeAmount,
        depositFee: networkFee,
        depositFeeTokenId: this.tokenId,
        paymentAddress,
        priority
      });

      L.info(`Deposit with id: ${depositId} and address: ${walletAddress}`)

      /** Step 2: trade */
      const tradeResponse = this.tradeAPI({
        depositId,
        tradingFee,
        buyAmount,
        buyTokenId
      })

      L.info(`Trade response: ${tradeResponse}`)

      /** Step 3: send transaction */
      const paymentInfos: PaymentInfoModel[] = [{
          paymentAddressStr: paymentAddress,
          amount: `${tradeAmount}`,
          message: '',
      }];
      const transaction = this.transfer({
        paymentInfoList: paymentInfos,
        nativeFee: `${serverFee + tradeAmount}`
      })

      await storage.set(KEYS.TRADE_PENDING_SEND_TRANSACTION, { buyTokenId: true })
      L.info(`Trade send transaction info: ${transaction}`)
      return transaction;
    } catch (error) {
      L.info(`Trade error: ${error}`)
      throw error;
    }
  }
}

export default NativeToken;

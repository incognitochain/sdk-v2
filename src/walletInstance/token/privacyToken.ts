import Token from './token';
import PrivacyTokenModel from '@src/models/token/privacyToken';
import AccountKeySetModel from '@src/models/key/accountKeySet';
import sendPrivacyToken from '@src/services/tx/sendPrivacyToken';
import { DEFAULT_NATIVE_FEE } from '@src/constants/constants';
import PaymentInfoModel from '@src/models/paymentInfo';
import sendBurningRequest from '@src/services/tx/sendBurningRequest';
import { hasExchangeRate } from '@src/services/token';
import sendPrivacyTokenPdeContribution from '@src/services/tx/sendPrivacyTokenPdeContribution';
import sendPrivacyTokenPdeTradeRequest from '@src/services/tx/sendPrivacyTokenPdeTradeRequest';
import Validator from '@src/utils/validator';

interface PrivacyTokenParam {
  tokenId: string,
  name: string,
  symbol: string,
  totalSupply: number,
  accountKeySet: AccountKeySetModel
};

class PrivacyToken extends Token implements PrivacyTokenModel {
  tokenId: string;
  name: string;
  symbol: string;
  isPrivacyToken: boolean;
  totalSupply: number;

  constructor({ accountKeySet, tokenId, name, symbol, totalSupply }: PrivacyTokenParam) {
    new Validator('accountKeySet', accountKeySet).required();
    new Validator('tokenId', tokenId).required().string();
    new Validator('name', name).required().string();
    new Validator('symbol', symbol).required().string();
    new Validator('totalSupply', totalSupply).required().amount();

    super({ accountKeySet, tokenId, name, symbol });

    this.totalSupply = totalSupply;
    this.isPrivacyToken = true;
  }

  async hasExchangeRate() {
    return await hasExchangeRate(this.tokenId);
  }

  async getNativeAvailableCoins() {
    return this.getAvailableCoins(null);
  }

  async transfer(paymentList: PaymentInfoModel[], nativeFee: number, privacyFee: number) {
    try {
      new Validator('paymentList', paymentList).required();
      new Validator('nativeFee', nativeFee).required().amount();
      new Validator('privacyFee', privacyFee).required().amount();
  
      L.info(`Privacy token ${this.tokenId} transfer`, { paymentList, nativeFee, privacyFee });

      const history = await sendPrivacyToken({
        accountKeySet: this.accountKeySet,
        nativeAvailableCoins: await this.getNativeAvailableCoins(),
        privacyAvailableCoins: await this.getAvailableCoins(),
        nativeFee,
        privacyFee,
        privacyPaymentInfoList: paymentList,
        nativePaymentInfoList: [],
        tokenId: this.tokenId,
        tokenName: this.name,
        tokenSymbol: this.symbol,
      });
  
      L.info(`Privacy token ${this.tokenId} transfered successfully with tx id ${history.txId}`);
  
      return history;
    } catch (e) {
      L.error(`Privacy token ${this.tokenId} transfered failed`, e);
      throw e;
    }
  }

  async burning(outchainAddress: string, burningAmount: number, nativeFee: number, privacyFee: number) {
    try {
      new Validator('outchainAddress', outchainAddress).required().string();
      new Validator('burningAmount', burningAmount).required().amount();
      new Validator('nativeFee', nativeFee).required().amount();
      new Validator('privacyFee', privacyFee).required().amount();
  
      L.info(`Privacy token ${this.tokenId} send burning request`, {outchainAddress, burningAmount, nativeFee, privacyFee});

      const history = await sendBurningRequest({
        accountKeySet: this.accountKeySet,
        nativeAvailableCoins: await this.getNativeAvailableCoins(),
        privacyAvailableCoins: await this.getAvailableCoins(),
        nativeFee,
        privacyFee,
        tokenId: this.tokenId,
        tokenName: this.name,
        tokenSymbol: this.symbol,
        outchainAddress,
        burningAmount
      });
  
      L.info(`Privacy token ${this.tokenId} send burning request successfully with tx id ${history.txId}`);
  
      return history;
    } catch (e) {
      L.error(`Privacy token ${this.tokenId} sent burning request failed`, e);
      throw e;
    } 
  }

  async pdeContribution(pdeContributionPairID: string, contributedAmount: number, nativeFee: number, privacyFee: number) {
    try {
      new Validator('pdeContributionPairID', pdeContributionPairID).required().string();
      new Validator('contributedAmount', contributedAmount).required().amount();
      new Validator('nativeFee', nativeFee).required().amount();
      new Validator('privacyFee', privacyFee).required().amount();
  
      L.info(`Privacy token ${this.tokenId} sent PDE contribution request`, {pdeContributionPairID, contributedAmount, nativeFee, privacyFee});

      const history = await sendPrivacyTokenPdeContribution({
        accountKeySet: this.accountKeySet,
        availableNativeCoins: await this.getNativeAvailableCoins(),
        privacyAvailableCoins: await this.getAvailableCoins(),
        nativeFee,
        pdeContributionPairID,
        tokenId: this.tokenId,
        contributedAmount,
        privacyFee,
        tokenSymbol: this.symbol,
        tokenName: this.name
      });
  
      L.info(`Privacy token ${this.tokenId} sent PDE contribution request successfully with tx id ${history.txId}`);
  
      return history;
    } catch (e) {
      L.error(`Privacy token ${this.tokenId} sent PDE contribution request failed`, e);
      throw e;
    }
  }

  async requestTrade(tokenIdBuy: TokenIdType, sellAmount: number, minimumAcceptableAmount: number, nativeFee: number, privacyFee: number, tradingFee: number) {
    try {
      new Validator('tokenIdBuy', tokenIdBuy).required().string();
      new Validator('sellAmount', sellAmount).required().amount();
      new Validator('minimumAcceptableAmount', minimumAcceptableAmount).required().amount();
      new Validator('nativeFee', nativeFee).required().amount();
      new Validator('privacyFee', privacyFee).required().amount();
      new Validator('tradingFee', tradingFee).required().amount();
  
      L.info(`Privacy token ${this.tokenId} sent trade request`, {tokenIdBuy, sellAmount, minimumAcceptableAmount, nativeFee, privacyFee, tradingFee});

      const history = await sendPrivacyTokenPdeTradeRequest({
        accountKeySet: this.accountKeySet,
        availableNativeCoins: await this.getNativeAvailableCoins(),
        privacyAvailableCoins: await this.getAvailableCoins(),
        nativeFee,
        tradingFee,
        privacyFee,
        tokenIdBuy,
        sellAmount,
        minimumAcceptableAmount,
        tokenName: this.name,
        tokenSymbol: this.symbol,
        tokenId: this.tokenId,
      });
  
      L.info(`Privacy token ${this.tokenId} sent trade request successfully with tx id ${history.txId}`);
  
      return history;
    } catch (e) {
      L.error(`Privacy token ${this.tokenId} sent trade request failed`, e);
      throw e;
    }
  }
}

export default PrivacyToken;
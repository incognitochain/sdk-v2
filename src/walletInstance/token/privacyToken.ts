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
    new Validator('paymentList', paymentList).required();
    new Validator('nativeFee', nativeFee).required().amount();
    new Validator('privacyFee', privacyFee).required().amount();

    return sendPrivacyToken({
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
  }

  async burning(outchainAddress: string, burningAmount: number, nativeFee: number, privacyFee: number) {
    new Validator('outchainAddress', outchainAddress).required().string();
    new Validator('burningAmount', burningAmount).required().amount();
    new Validator('nativeFee', nativeFee).required().amount();
    new Validator('privacyFee', privacyFee).required().amount();

    return sendBurningRequest({
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
  }

  async pdeContribution(pdeContributionPairID: string, contributedAmount: number, nativeFee: number, privacyFee: number) {
    new Validator('pdeContributionPairID', pdeContributionPairID).required().string();
    new Validator('contributedAmount', contributedAmount).required().amount();
    new Validator('nativeFee', nativeFee).required().amount();
    new Validator('privacyFee', privacyFee).required().amount();

    return sendPrivacyTokenPdeContribution({
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
  }

  async requestTrade(tokenIdBuy: TokenIdType, sellAmount: number, minimumAcceptableAmount: number, nativeFee: number, privacyFee: number, tradingFee: number) {
    new Validator('tokenIdBuy', tokenIdBuy).required().string();
    new Validator('sellAmount', sellAmount).required().amount();
    new Validator('minimumAcceptableAmount', minimumAcceptableAmount).required().amount();
    new Validator('nativeFee', nativeFee).required().amount();
    new Validator('privacyFee', privacyFee).required().amount();
    new Validator('tradingFee', tradingFee).required().amount();

    return sendPrivacyTokenPdeTradeRequest({
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
  }
}

export default PrivacyToken;
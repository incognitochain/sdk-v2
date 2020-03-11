import { TokenInfo } from '@src/constants';
import Token from './token';
import NativeTokenModel from '@src/models/token/nativeToken';
import AccountKeySetModel from '@src/models/key/accountKeySet';
import sendNativeToken from '@src/services/tx/sendNativeToken';
import { DEFAULT_NATIVE_FEE } from '@src/constants/constants';
import PaymentInfoModel from '@src/models/paymentInfo';
import sendStakingRequest from '@src/services/tx/sendStakingRequest';
import sendNativeTokenPdeContribution from '@src/services/tx/sendNativeTokenPdeContribution';
import sendNativeTokenPdeTradeRequest from '@src/services/tx/sendNativeTokenPdeTradeRequest';
import Validator from '@src/utils/validator';

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

  async transfer(paymentInfoList: PaymentInfoModel[], nativeFee = DEFAULT_NATIVE_FEE) {
    new Validator('paymentInfoList', paymentInfoList).required();
    new Validator('nativeFee', nativeFee).required().amount();

    return sendNativeToken({ nativePaymentInfoList: paymentInfoList, nativeFee: nativeFee, accountKeySet: this.accountKeySet, availableCoins: await this.getAvailableCoins() });
  }

  async requestStaking(rewardReceiverPaymentAddress: string, nativeFee: number) {
    new Validator('rewardReceiverPaymentAddress', rewardReceiverPaymentAddress).required().string();
    new Validator('nativeFee', nativeFee).required().amount();

    return sendStakingRequest({
      candidateAccountKeySet: this.accountKeySet,
      availableNativeCoins: await this.getAvailableCoins(),
      nativeFee,
      rewardReceiverPaymentAddress,
      autoReStaking: true
    });
  }

  async pdeContribution(pdeContributionPairID: string, contributedAmount: number, nativeFee: number) {
    new Validator('pdeContributionPairID', pdeContributionPairID).required().string();
    new Validator('contributedAmount', contributedAmount).required().amount();
    new Validator('nativeFee', nativeFee).required().amount();

    return sendNativeTokenPdeContribution({
      accountKeySet: this.accountKeySet,
      availableNativeCoins: await this.getAvailableCoins(),
      nativeFee,
      pdeContributionPairID,
      tokenId: this.tokenId,
      contributedAmount
    });
  }

  async requestTrade(tokenIdBuy: TokenIdType, sellAmount: number, minimumAcceptableAmount: number, nativeFee: number, tradingFee: number) {
    new Validator('tokenIdBuy', tokenIdBuy).required().string();
    new Validator('sellAmount', sellAmount).required().amount();
    new Validator('minimumAcceptableAmount', minimumAcceptableAmount).required().amount();
    new Validator('nativeFee', nativeFee).required().amount();
    new Validator('tradingFee', tradingFee).required().amount();

    return sendNativeTokenPdeTradeRequest({
      accountKeySet: this.accountKeySet,
      availableNativeCoins: await this.getAvailableCoins(),
      nativeFee,
      tradingFee,
      tokenIdBuy,
      tokenIdSell: this.tokenId,
      sellAmount,
      minimumAcceptableAmount
    });
  }
}

export default NativeToken;
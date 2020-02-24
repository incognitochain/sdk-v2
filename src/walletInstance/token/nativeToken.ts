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

class NativeToken extends Token implements NativeTokenModel {
  tokenId: string;
  name: string;
  symbol: string;
  isNativeToken: boolean;

  constructor(accountKeySet: AccountKeySetModel) {
    super({ accountKeySet, tokenId: null, name: null, symbol: null });

    this.tokenId = TokenInfo.NATIVE_TOKEN.tokenId;
    this.name = TokenInfo.NATIVE_TOKEN.name;
    this.symbol = TokenInfo.NATIVE_TOKEN.symbol;
    this.isNativeToken = true;
  }

  async transfer(paymentInfoList: PaymentInfoModel[], nativeFee = DEFAULT_NATIVE_FEE) {
    return sendNativeToken({ nativePaymentInfoList: paymentInfoList, nativeFee: nativeFee, accountKeySet: this.accountKeySet, availableCoins: await this.getAvailableCoins() });
  }

  async requestStaking(rewardReceiverPaymentAddress: string, nativeFee: number) {
    return sendStakingRequest({
      candidateAccountKeySet: this.accountKeySet,
      availableNativeCoins: await this.getAvailableCoins(),
      nativeFee,
      rewardReceiverPaymentAddress,
      autoReStaking: true
    });
  }

  async pdeContribution(pdeContributionPairID: string, contributedAmount: number, nativeFee: number) {
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
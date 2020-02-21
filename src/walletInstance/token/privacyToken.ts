import Token from './token';
import PrivacyTokenModel from '@src/models/token/privacyToken';
import AccountKeySetModel from '@src/models/key/accountKeySet';
import sendPrivacyToken from '@src/services/tx/sendPrivacyToken';
import { DEFAULT_NATIVE_FEE } from '@src/constants/constants';
import PaymentInfoModel from '@src/models/paymentInfo';
import sendBurningRequest from '@src/services/tx/sendBurningRequest';
import { hasExchangeRate } from '@src/services/token';

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
    super({ accountKeySet, tokenId, name, symbol });

    this.totalSupply = totalSupply;
    this.isPrivacyToken = true;
  }

  async hasExchangeRates() {
    return await hasExchangeRate(this.tokenId);
  }

  async getNativeAvailableCoins() {
    return this.getAvailableCoins(null);
  }

  async transfer(paymentList: PaymentInfoModel[], nativeFee: number, privacyFee: number) {
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
}

export default PrivacyToken;
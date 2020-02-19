import Token from './token';
import PrivacyTokenModel from '@src/models/token/privacyToken';
import AccountKeySetModel from '@src/models/key/accountKeySet';
import sendPrivacyToken from '@src/services/tx/sendPrivacyToken';
import { DEFAULT_NATIVE_FEE } from '@src/constants/constants';

interface PrivacyTokenParam {
  tokenId: string,
  name: string,
  symbol: string,
  totalSupply: number,
  accountKeySet: AccountKeySetModel
};

class PrivacyToken extends Token implements PrivacyTokenModel{
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

  async getNativeAvailableCoins() {
    return this.getAvailableCoins(null);
  }

  async transfer({ nativeFee = DEFAULT_NATIVE_FEE, privacyFee = 0, paymentList = [
    {
      paymentAddressStr: '12S1sAiqwpTCaYaftMC9N8ytPiJZCnpeMYXCMrbC7FxQcitn9HMensYhJrFdv7tnkaNYSXRafc1NS6svpy9YUvfe7Dq6yhy5zqBfh9q',
      amount: 1,
      message: 'Cool'
    }
  ]} = {}) {
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
}

export default PrivacyToken;
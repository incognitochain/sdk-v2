import Token from './token';
import PrivacyTokenModel from '@src/models/token/privacyToken';
import AccountKeySetModel from '@src/models/key/accountKeySet';

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

  // async transfer({ fee = 10, paymentList = [
  //   {
  //     paymentAddressStr: '12S1sAiqwpTCaYaftMC9N8ytPiJZCnpeMYXCMrbC7FxQcitn9HMensYhJrFdv7tnkaNYSXRafc1NS6svpy9YUvfe7Dq6yhy5zqBfh9q',
  //     amount: 1,
  //     message: 'Cool'
  //   }
  // ]} = {}) {
  //   const send = new SendPrivacyTokenService({
  //     privacyToken: this,
  //     account: this.account,
  //     nativeTokenFee: fee,
  //     privacyTokenFee: 0,
  //     privacyTokenPaymentList: paymentList,
  //     nativeTokenPaymentList: paymentList
  //   });
  //   return await send.send();
  // }
}

export default PrivacyToken;
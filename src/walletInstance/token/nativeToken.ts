import { TokenInfo } from '@src/constants';
import Token from './token';
import NativeTokenModel from '@src/models/token/nativeToken';
import AccountKeySetModel from '@src/models/key/accountKeySet';

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

  // async transfer({ fee = 10, paymentInfoList = [
  //   {
  //     paymentAddressStr: '12S1sAiqwpTCaYaftMC9N8ytPiJZCnpeMYXCMrbC7FxQcitn9HMensYhJrFdv7tnkaNYSXRafc1NS6svpy9YUvfe7Dq6yhy5zqBfh9q',
  //     amount: 1,
  //     message: 'Cool'
  //   }
  // ]} = {}) {
  //   const send = new SendNativeTokenService({ account: this.account, nativeTokenFee: fee, paymentInfoList });
  //   return await send.send();
  // }
}

export default NativeToken;
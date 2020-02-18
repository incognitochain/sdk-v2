import _ from 'lodash';
import BaseAccount from './baseAccount';
import { NativeToken, PrivacyToken } from '../token';
import AccountModel from '@src/models/account/account';
import KeyWalletModel from '@src/models/key/keyWallet';
import rpc from '@src/services/rpc';
import initPrivacyToken from '@src/services/send/initPrivacyToken';
import { getUnspentCoins } from '@src/services/coin';
import { DEFAULT_NATIVE_FEE } from '@src/constants/constants';

interface AccountModelInterface extends AccountModel {
  nativeToken: NativeToken;
};

interface IssuePrivacyTokenInterface {
  tokenName: string,
  tokenSymbol: string,
  supplyAmount: number,
  nativeTokenFee: number
};

class Account extends BaseAccount implements AccountModelInterface {
  isImport: boolean;
  nativeToken: NativeToken;
  privacyTokenIds: string[];
  

  constructor(name: string, key: KeyWalletModel, isImport: boolean) {
    super(name);

    this.isImport = isImport;
    this.nativeToken = new NativeToken(key.keySet);
    this.privacyTokenIds = [];
    this.key = key;

    this.init();
  }

  init() {
    this.serializeKeys();
  }

  followTokenById(tokenId: TokenIdType) {
    if (!this.privacyTokenIds.includes(tokenId)) {
      this.privacyTokenIds.push(tokenId);
    }
  }

  unfollowTokenById(tokenId: TokenIdType) {
    _.remove(this.privacyTokenIds, id => id === tokenId);
  }
  
  async issuePrivacyToken({ tokenName, tokenSymbol, supplyAmount, nativeTokenFee = DEFAULT_NATIVE_FEE } : IssuePrivacyTokenInterface) {
    const availableCoins = await this.nativeToken.getAvailableCoins();
    
    return initPrivacyToken({
      accountKeySet: this.key.keySet,
      availableNativeCoins: availableCoins,
      nativeFee: nativeTokenFee,
      tokenName,
      tokenSymbol,
      supplyAmount
    });
  }

  /**
   * Find by tokenId or all if tokenId is null
   * @param {*} tokenId 
   */
  async getFollowingPrivacyToken(tokenId: TokenIdType) {
    const tokens = await rpc.listPrivacyCustomTokens();
    const privacyTokens = (tokenId ? [tokenId] : this.privacyTokenIds).map(id => {
      const token = tokens.find((token: { [key: string]: any }) => token.ID === id);
      if (token) {
        return new PrivacyToken({
          accountKeySet: this.key.keySet,
          tokenId: token.ID,
          name: token.Name,
          symbol: token.Symbol,
          totalSupply: token.Amount,
        });
      }
    });

    if (privacyTokens && privacyTokens?.length) {
      return tokenId ? privacyTokens[0] : privacyTokens;
    }

    return null;
  }
}

export default Account;
import _ from 'lodash';
import BaseAccount from './baseAccount';
import { NativeToken, PrivacyToken } from '../token';
import AccountModel from '@src/models/account/account';
import KeyWalletModel from '@src/models/key/keyWallet';
import rpc from '@src/services/rpc';
import initPrivacyToken from '@src/services/tx/initPrivacyToken';
import { restoreKeyWalletFromBackupData } from '@src/services/key/keyWallet';
import { DEFAULT_NATIVE_FEE } from '@src/constants/constants';
import { getBLSPublicKeyB58CheckEncode } from '@src/services/key/accountKeySet';
import { getRewardAmount, getStakerStatus } from '@src/services/node';
import Validator from '@src/utils/validator';

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
  private _blsPublicKeyB58CheckEncode: string;
  

  constructor(name: string, key: KeyWalletModel, isImport: boolean) {
    new Validator('name', name).required().string();
    new Validator('key', key).required();
    new Validator('isImport', isImport).required().boolean();

    super(name);

    this.isImport = isImport;
    this.nativeToken = new NativeToken(key.keySet);
    this.privacyTokenIds = [];
    this.key = key;
    this._blsPublicKeyB58CheckEncode = null;

    this.init();
  }

  static restoreFromBackupData(data: any) {
    new Validator('data', data).required();

    const { name, key, privacyTokenIds, isImport } = data;
    const keyWallet = restoreKeyWalletFromBackupData(key);

    const account = new Account(name, keyWallet, isImport);
    account.privacyTokenIds = privacyTokenIds

    return account;
  }

  init() {
    this.serializeKeys();
  }

  async getBLSPublicKeyB58CheckEncode() {
    // get from cache
    if (this._blsPublicKeyB58CheckEncode) {
      return this._blsPublicKeyB58CheckEncode;
    }

    return this._blsPublicKeyB58CheckEncode = await getBLSPublicKeyB58CheckEncode(this.key.keySet.miningSeedKey);
  }

  followTokenById(tokenId: TokenIdType) {
    new Validator('tokenId', tokenId).required().string();

    // TODO verify token id
    if (!this.privacyTokenIds.includes(tokenId)) {
      this.privacyTokenIds.push(tokenId);
    }
  }

  unfollowTokenById(tokenId: TokenIdType) {
    new Validator('tokenId', tokenId).required().string();

    _.remove(this.privacyTokenIds, id => id === tokenId);
  }
  
  async issuePrivacyToken({ tokenName, tokenSymbol, supplyAmount, nativeTokenFee = DEFAULT_NATIVE_FEE } : IssuePrivacyTokenInterface) {
    const missingError = 'Please make sure your params are following format { tokenName, tokenSymbol, supplyAmount, nativeTokenFee }';
    new Validator('tokenName', tokenName).required(missingError).string();
    new Validator('tokenSymbol', tokenSymbol).required(missingError).string();
    new Validator('supplyAmount', supplyAmount).required(missingError).amount();
    new Validator('nativeTokenFee', nativeTokenFee).required(missingError).amount();

    const availableCoins = await this.nativeToken.getAvailableCoins();
    
    const txHistory = await initPrivacyToken({
      accountKeySet: this.key.keySet,
      availableNativeCoins: availableCoins,
      nativeFee: nativeTokenFee,
      tokenName,
      tokenSymbol,
      supplyAmount
    });

    // follow this new token
    this.followTokenById(txHistory.privacyTokenInfo.tokenId);

    return txHistory;
  }

  /**
   * Find by tokenId or all if tokenId is null
   * @param {*} tokenId 
   */
  async getFollowingPrivacyToken(tokenId: TokenIdType) {
    new Validator('tokenId', tokenId).string();

    // TODO filter invalid token
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

  getBackupData() {
    const data = super.getBackupData();

    return {
      privacyTokenIds: this.privacyTokenIds,
      isImport: this.isImport,
      ...data
    };
  }

  async getNodeRewards() {
    return getRewardAmount(this.key.keySet);
  }

  async getNodeStatus() {
    return getStakerStatus(await this.getBLSPublicKeyB58CheckEncode());
  }
}

export default Account;
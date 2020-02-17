import _ from 'lodash';
import BaseAccount from './baseAccount';
import { KeyWallet } from '@src/key';
import {
  PaymentAddressType,
  ViewingKeyType,
  PriKeyType,
} from '@src/services/wallet/constants';
import rpc from '@src/services/rpc';
import InitPrivacyToken from '@src/services/send/initPrivacyToken';
import Validator from '@src/utils/validator';
import { checkEncode } from '@src/utils/base58';
import { ENCODE_VERSION, ED25519_KEY_SIZE } from '@src/constants/constants';
import { getShardIDFromLastByte } from '@src/utils/common';
import {generateBLSPubKeyB58CheckEncodeFromSeed } from '@src/services/key/generator';
import { hashSha3BytesToBytes } from '@src/privacy/utils';
import { NativeToken, PrivacyToken } from '@src/token';
import MasterAccountModel from '@src/models/account/masterAccount';
import AccountModel from '@src/models/account/account';
import AccountKeySetModel from '@src/models/key/accountKeySet';

type ShardId = number;
type AccountIndex = number;
type PrivateKey = string;
type TokenId = string;

interface AccountModelInterface extends AccountModel {
  nativeToken: NativeToken;
};

interface CreateInterface {
  shardId: ShardId,
  accountIndex: AccountIndex
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
  

  constructor(name: string, accountKeySet: AccountKeySetModel, isImport: boolean) {
    super(name);

    this.isImport = false;
    this.nativeToken = new NativeToken({ account: this });
    this.privacyTokenIds = [];
    this.key.KeySet = accountKeySet;


    // isRevealViewKeyToGetCoins is true: reveal private viewing key when request for getting all output coins
    // this.isRevealViewKeyToGetCoins = false;
  }

  getMasterAccount() {}
  
  create(accountKeySet: AccountKeySetModel) {
    new Validator('account shardId', shardId).shardId();
    new Validator('account index', accountIndex).required().intergerNumber();
    
    if (shardId) {
      this.key = this._createKeyByShardId(shardId, accountIndex);
    } else {
      this.key = this.masterAccount.key.newChildKey(accountIndex);
    }

    return this;
  } 

  import(accountKeySet: AccountKeySetModel) {
    new Validator('account privateKey', privateKey).required().privateKey();

    try {
      this.key = KeyWallet.base58CheckDeserialize(privateKey);
      if (this.key.KeySet.PrivateKey.length != ED25519_KEY_SIZE) {
        throw new Error('Private key is empty');
      }
    } catch (e) {
      throw new Error('Invalid private key');
    }
    this.key.KeySet.importFromPrivateKey(this.key.KeySet.PrivateKey);

    this.isImport = true;

    return this;
  }

  _createKeyByShardId(shardId: ShardId, accountIndex: AccountIndex) {
    let childKey;
    let lastByte;
    do {
      childKey = this.masterAccount.key.newChildKey(accountIndex);
      lastByte = childKey.KeySet.PaymentAddress.Pk[childKey.KeySet.PaymentAddress.Pk.length - 1];
      accountIndex += 1;
    } while(typeof shardId === 'number' && getShardIDFromLastByte(lastByte) !== shardId);

    return childKey;
  }

  followTokenById(tokenId: TokenId) {
    new Validator('tokenId', tokenId).required().string();

    if (!this.privacyTokenIds.includes(tokenId)) {
      this.privacyTokenIds.push(tokenId);
    }
  }

  unfollowTokenById(tokenId: TokenId) {
    new Validator('tokenId', tokenId).required().string();

    _.remove(this.privacyTokenIds, id => id === tokenId);
  }

  issuePrivacyToken({ tokenName, tokenSymbol, supplyAmount, nativeTokenFee = 10 } : IssuePrivacyTokenInterface) {
    new Validator('tokenId', tokenName).required().string();
    new Validator('tokenId', tokenSymbol).required().string();
    new Validator('tokenId', supplyAmount).required().amount();

    return new InitPrivacyToken({
      nativeTokenFee,
      account: this,
      tokenName,
      tokenSymbol,
      supplyAmount
    }).send();
  }

  /**
   * Find by tokenId or all if tokenId is null
   * @param {*} tokenId 
   */
  async getFollowingPrivacyTokenAsync(tokenId: TokenId) {
    const tokens = await rpc.listPrivacyCustomTokens();
    const privacyTokens = (tokenId ? [tokenId] : this.privacyTokenIds).map(id => {
      const token = tokens.find(token => token.ID === id);
      if (token) {
        return new PrivacyToken({
          account: this,
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
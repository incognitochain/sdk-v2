import BaseModel from '@src/models/baseModel';
import {
  ChildNumberSize,
  ChainCodeSize,
} from '@src/constants/wallet';
import AccountKeySetModel from './accountKeySet';

class KeyWalletModel extends BaseModel {
  depth: number;
  childNumber: Uint8Array;
  chainCode: Uint8Array;
  keySet: AccountKeySetModel;

  constructor() {
    super();

    this.depth = 0;                                       // 1 byte
    this.childNumber = new Uint8Array(ChildNumberSize);   // 4 bytes
    this.chainCode = new Uint8Array(ChainCodeSize);       // 32 bytes
    this.keySet = null;
  }
}

export default KeyWalletModel;
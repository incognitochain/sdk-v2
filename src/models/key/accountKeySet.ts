import BaseModel from '../baseModel';
import { ENCODE_VERSION } from '@src/constants/constants';
import PrivateKeyModel from './privateKey';
import PaymentAddressKeyModel from './paymentAddress';
import ViewingKeyModel from './viewingKey';
import { byteToHexString } from '@src/utils/common';
import { hashSha3BytesToBytes } from '@src/privacy/utils';
import { checkEncode } from '@src/utils/base58';


interface AccountKeySetParam {
  privateKey: PrivateKeyModel;
  paymentAddress: PaymentAddressKeyModel;
  viewingKey: ViewingKeyModel;
};

type AllKeyType = PrivateKeyModel | PaymentAddressKeyModel | ViewingKeyModel;

class AccountKeySetModel extends BaseModel {
  privateKey: PrivateKeyModel;
  paymentAddress: PaymentAddressKeyModel;
  viewingKey: ViewingKeyModel;
  privateKeySerialized: string;
  viewingKeySerialized: string;
  paymentAddressKeySerialized: string;
  index: number;
  // blsPublicKeySerialized: string;

  constructor({ privateKey, paymentAddress, viewingKey } : AccountKeySetParam) {
    super();

    this.privateKey = privateKey;
    this.paymentAddress = paymentAddress;
    this.viewingKey = viewingKey;
    this.privateKeySerialized = null;
    this.paymentAddressKeySerialized = null;
    this.viewingKeySerialized = null;
    // this.blsPublicKeySerialized = null;
  }

  get publicKeySerialized(): string {
    return byteToHexString(this.paymentAddress.publicKeyBytes);
  }

  get publicKeyCheckEncode(): string {
    return checkEncode(this.paymentAddress.publicKeyBytes, ENCODE_VERSION);
  }

  get miningSeedKey(): number[] {
    return hashSha3BytesToBytes(hashSha3BytesToBytes(this.privateKey.privateKeyBytes));
  }

  get validatorKey(): string {
    return checkEncode(this.miningSeedKey, ENCODE_VERSION);
  }
}

export default AccountKeySetModel;

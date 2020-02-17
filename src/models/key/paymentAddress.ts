import BaseKeyModel from './baseKey';
import { PaymentAddressType } from '@src/services/wallet/constants';
import { PUBLIC_KEY_SIZE, PAYMENT_ADDR_SIZE } from '@src/constants/constants';

class PaymentAddressKeyModel extends BaseKeyModel {
  publicKeyBytes: KeyBytes;
  transmissionKeyBytes: KeyBytes;

  constructor() {
    super();

    this.publicKeyBytes = null;
    this.transmissionKeyBytes = null;
    this.keyType = PaymentAddressType;
  }

  toBytes() {
    let paymentAddrBytes = new Uint8Array(PAYMENT_ADDR_SIZE);
    paymentAddrBytes.set(this.publicKeyBytes);
    paymentAddrBytes.set(this.transmissionKeyBytes, PUBLIC_KEY_SIZE);
    return paymentAddrBytes;
  }
}

export default PaymentAddressKeyModel;
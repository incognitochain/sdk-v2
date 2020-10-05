import BaseModel from './baseModel';

interface PaymentInfoModelParam {
  paymentAddress: string,
  amount: string,
  message: string
};

class PaymentInfoModel extends BaseModel {
  paymentAddressStr: string;
  amount: string;
  message: string;

  constructor({ paymentAddress, amount, message } : PaymentInfoModelParam) {
    super();

    this.paymentAddressStr = paymentAddress;
    this.amount = amount;
    this.message = message;
  }
}

export default PaymentInfoModel;

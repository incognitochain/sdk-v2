import BaseModel from './baseModel';

interface PaymentInfoModelParam {
  paymentAddress: string,
  amount: number,
  message: string
};

class PaymentInfoModel extends BaseModel {
  paymentAddressStr: string;
  amount: number;
  message: string;

  constructor({ paymentAddress, amount, message } : PaymentInfoModelParam) {
    super();
    
    this.paymentAddressStr = paymentAddress;
    this.amount = amount;
    this.message = message;
  }
}

export default PaymentInfoModel;
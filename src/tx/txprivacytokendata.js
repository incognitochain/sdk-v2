// CustomTokenParamTx - use for rpc request json body
class PrivacyTokenParamTx {
  constructor() {
    this.propertyID = '';
    this.propertyName = '';
    this.propertySymbol = '';
    this.amount = 0;            // amount just has value when initting token, amount = 0 when transfer
    this.tokenTxType = 0;
    this.receivers = [];       // []*privacy.PaymentInfo
    this.tokenInputs = [];     // []*privacy.InputCoin
  }

  set(propertyID, propertyName, propertySymbol, amount, tokenTxType, receivers, tokenInputs) {
    this.propertyID = propertyID;
    this.propertyName = propertyName;
    this.propertySymbol = propertySymbol;
    this.amount = amount;
    this.tokenTxType = tokenTxType;
    this.receivers = receivers;
    this.tokenInputs = tokenInputs;
  }
}

export { PrivacyTokenParamTx };

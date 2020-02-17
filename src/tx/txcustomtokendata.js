// CustomTokenParamTx - use for rpc request json body
class CustomTokenParamTx {
  constructor() {
    this.propertyID = '';
    this.propertyName = '';
    this.propertySymbol = '';

    this.amount = 0;        // amount just has value when initting token, amount = 0 when transfer
    this.tokenTxType = 0;           
    this.receivers = [];          //       []TxTokenVout `json:"TokenReceiver"`

    // temp variable to process coding
    this.vins = [];        //[]TxTokenVin
    this.vinsAmount = 0;
  }

  set(propertyID, propertyName, propertySymbol, amount, tokenTxType, receivers, vins, vinsAmount){
    this.propertyID = propertyID;
    this.propertyName = propertyName;
    this.propertySymbol = propertySymbol;
    this.amount = amount;
    this.tokenTxType = tokenTxType;
    this.receivers = receivers;
    this.vins = vins;
    this.vinsAmount = vinsAmount;
  }
}

export { CustomTokenParamTx };

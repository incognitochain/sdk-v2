import BaseModel from '../baseModel';

interface BridgeHistoryModelParam {
  ID: number;
  UserID: number;
  Address: string;
  ExpiredAt: string;
  AddressType: number;
  Status: number;
  CurrencyType: number;
  WalletAddress: string;
  UserPaymentAddress: string;
  RequestedAmount: string;
  ReceivedAmount: string;
  IncognitoAmount: string;
  EthereumTx: string;
  IncognitoTx: string;
  Erc20TokenTx: string;
  PrivacyTokenAddress: string;
  Erc20TokenAddress: string;
  CreatedAt: string;
  UpdatedAt: string;
  Decentralized: number;
  OutChainTx: string;
  InChainTx: string;
};

class BridgeHistoryModel extends BaseModel {
  id: number;
  userID: number;
  address: string;
  expiredAt: string;
  addressType: number;
  status: number;
  currencyType: number;
  walletAddress: string;
  userPaymentAddress: string;
  requestedAmount: string;
  receivedAmount: string;
  incognitoAmount: string;
  ethereumTx: string;
  incognitoTx: string;
  erc20TokenTx: string;
  privacyTokenAddress: string;
  erc20TokenAddress: string;
  createdAt: string;
  updatedAt: string;
  decentralized: number;
  outChainTx: string;
  inChainTx: string;

  constructor(data: BridgeHistoryModelParam) {
    super();
    this.id = data.ID;
    this.address = data.Address;
    this.addressType = data.AddressType;
    this.createdAt = data.CreatedAt;
    this.currencyType = data.CurrencyType;
    this.decentralized = data.Decentralized;
    this.erc20TokenAddress = data.Erc20TokenAddress;
    this.erc20TokenTx = data.Erc20TokenTx;
    this.ethereumTx = data.EthereumTx;
    this.expiredAt = data.ExpiredAt;
    this.inChainTx = data.InChainTx;
    this.incognitoAmount = data.IncognitoAmount;
    this.incognitoTx = data.IncognitoTx;
    this.outChainTx = data.OutChainTx;
    this.privacyTokenAddress = data.PrivacyTokenAddress;
    this.receivedAmount = data.ReceivedAmount;
    this.requestedAmount = data.RequestedAmount;
    this.status = data.Status;
    this.updatedAt = data.UpdatedAt;
    this.userID = data.UserID;
    this.userPaymentAddress = data.UserPaymentAddress;
    this.walletAddress = data.WalletAddress;
  }
}

export default BridgeHistoryModel;
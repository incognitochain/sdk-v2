import BaseModel from "../baseModel";
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
}
declare class BridgeHistoryModel extends BaseModel {
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
    constructor(data: BridgeHistoryModelParam);
}
export default BridgeHistoryModel;
//# sourceMappingURL=bridgeHistory.d.ts.map
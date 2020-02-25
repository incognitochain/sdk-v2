import BaseModel from "./baseModel";
export interface CoinRawData {
    PublicKey: string;
    CoinCommitment: string;
    SNDerivator: string;
    Randomness: string;
    SerialNumber: string;
    Value: string;
    Info: string;
    CoinDetailsEncrypted: string;
}
declare class CoinModel extends BaseModel {
    publicKey: string;
    coinCommitment: string;
    snDerivator: string;
    randomness: string;
    serialNumber: string;
    value: string;
    info: string;
    coinDetailsEncrypted: string;
    constructor({ PublicKey, CoinCommitment, SNDerivator, Randomness, SerialNumber, Value, Info, CoinDetailsEncrypted }: CoinRawData);
    toJson(): CoinRawData;
}
export default CoinModel;
//# sourceMappingURL=coin.d.ts.map
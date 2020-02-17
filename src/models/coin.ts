import BaseModel from './baseModel';

export interface CoinRawData {
  PublicKey: string;
  CoinCommitment: string;
  SNDerivator: string;
  Randomness: string;
  SerialNumber: string;
  Value: string;
  Info: string;
  CoinDetailsEncrypted: string;
};

class CoinModel extends BaseModel {
  publicKey: string;
  coinCommitment: string;
  snDerivator: string;
  randomness: string;
  serialNumber: string;
  value: string;
  info: string;
  coinDetailsEncrypted: string;

  constructor({ PublicKey, CoinCommitment, SNDerivator, Randomness, SerialNumber, Value, Info, CoinDetailsEncrypted }: CoinRawData) {
    super();
    this.publicKey = PublicKey;
    this.coinCommitment = CoinCommitment;
    this.snDerivator = SNDerivator;
    this.randomness = Randomness;
    this.serialNumber = SerialNumber;
    this.value = Value;
    this.info = Info;
    this.coinDetailsEncrypted = CoinDetailsEncrypted;
  }

  toJson(): CoinRawData {
    return {
      PublicKey: this.publicKey,
      CoinCommitment: this.coinCommitment,
      SNDerivator: this.snDerivator,
      Randomness: this.randomness,
      SerialNumber: this.serialNumber,
      Value: this.value,
      Info: this.info,
      CoinDetailsEncrypted: this.coinDetailsEncrypted
    };
  }
}

export default CoinModel;
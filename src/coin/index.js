export class Coin {
  constructor() {
    this.PublicKey = '';
    this.CoinCommitment = '';
    this.SNDerivator = '';
    this.Randomness = '';
    this.SerialNumber = '';
    this.Value = '';
    this.Info = '';
  }
  set(publicKey, coinCommitment, snderivator, randomness, serialNumber, value, info){
    this.PublicKey = publicKey;
    this.CoinCommitment = coinCommitment;
    this.SNDerivator = snderivator;
    this.Randomness = randomness;
    this.SerialNumber = serialNumber;
    this.Value = value;
    this.Info = info;
  }
}
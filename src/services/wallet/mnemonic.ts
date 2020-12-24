import * as bip39 from 'bip39';

function newMnemonic() {
  return bip39.generateMnemonic();
}

function newSeed(mnemonic: string) {
  return bip39.mnemonicToSeedSync(mnemonic)
}

function validateMnemonic(mnemonic: string) {
  return bip39.validateMnemonic(mnemonic);
}

export const mnemonicService = {
  newMnemonic,
  newSeed,
  validateMnemonic,
};

export default mnemonicService;

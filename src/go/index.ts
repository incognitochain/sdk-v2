export { implementGoMethodManually, GO_METHOD_NAMES } from './implement';

export async function implementGoMethodUseWasm() {
  return await import('./wasm').then(async (wasmModule: any) => {
    const loadWasm = wasmModule.default;
    return await loadWasm();
  });
}

function getMethod(methodName: string) {
  let func;

  // find it
  if (__IS_WEB__ && typeof (window as { [key: string]: any })[methodName] === 'function') {
    func = (window as { [key: string]: any })[methodName];
  } else if (__IS_NODE__ && typeof (global as { [key: string]: any })[methodName] === 'function') {
    func = (global as { [key: string]: any })[methodName];
  }

  // then, cache it
  if (typeof func === 'function') {
    (methods as { [key: string]: any })[methodName] = func;
    return  func;
  } else {
    throw new ErrorCode(`
      Can not find GO method "${methodName}", please make sure it's been implemented.
      Use "implementGoMethodUseWasm" to automatically implement on Browser & NodeJS enviroment,
      or "implementGoMethodManually" on other enviroments (React Native)
    `);
  }
}

const methods = new Proxy({
  deriveSerialNumber: null,
  initPrivacyTx: null,
  randomScalars: null,
  staking: null,
  stopAutoStaking: null,
  initPrivacyTokenTx: null,
  withdrawDexTx: null,
  initPTokenTradeTx: null,
  initPRVTradeTx: null,
  initPTokenContributionTx: null,
  initPRVContributionTx: null,
  initWithdrawRewardTx: null,
  initBurningRequestTx: null,
  generateKeyFromSeed: null,
  scalarMultBase: null,
  hybridEncryptionASM: null,
  hybridDecryptionASM: null,
  generateBLSKeyPairFromSeed: null,
}, {
  get: function(obj, prop: string) {
    return (obj as { [key: string]: any })[prop] || getMethod(prop);
  },
  set: function(obj, prop: string, value: any) {
    if (typeof value === 'function') {
      (obj as { [key: string]: any })[prop] = value;
    } else {
      throw new ErrorCode(`${prop} must be a function`);
    }

    return true;
  }
});

export default methods;
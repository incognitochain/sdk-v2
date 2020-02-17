function getMethod(methodName: string) {
  let func;

  // find it
  if (__IS_WEB__ && typeof (window as { [key: string]: any })[methodName] === 'function') {
    func = (window as { [key: string]: any })[methodName];
  } else if (__IS_NODE__ && typeof (global as { [key: string]: any })[methodName] === 'function') {
    func = (window as { [key: string]: any })[methodName];
  }

  // then, cache it
  if (typeof func === 'function') {
    (methods as { [key: string]: any })[methodName] = func;
    return  func;
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
    console.log('get', prop);
    return (obj as { [key: string]: any })[prop] || getMethod(prop);
  },
  set: function(obj, prop: string, value: any) {
    if (typeof value === 'function') {
      (obj as { [key: string]: any })[prop] = value;
    } else {
      throw new TypeError(`${prop} must be a function`);
    }

    return true;
  }
});

export default methods;
// @ts-nocheck
export { implementGoMethodManually, GO_METHOD_NAMES } from './implement';

export async function implementGoMethodUseWasm() {
  return await import('./wasm').then(async (wasmModule: any) => {
    const loadWasm = wasmModule.default;
    return await loadWasm();
  });
}

const requiredTimeFuncName = [
  'initPrivacyTx',
  'stopAutoStaking',
  'staking',
  'initPrivacyTokenTx',
  'initBurningRequestTx',
  'initWithdrawRewardTx',
  'initPRVContributionTx',
  'initPTokenContributionTx',
  'initPRVTradeTx',
  'initPTokenTradeTx',
  'withdrawDexTx',
];

const asyncFuncName = [
  'generateBLSKeyPairFromSeed',
  'deriveSerialNumber',
  'randomScalars',
  'hybridEncryptionASM',
  'hybridDecryptionASM',
  'getSignPublicKey',
];

const syncFuncName = ['generateKeyFromSeed', 'scalarMultBase'];

async function getNodeTime() {
  return global.rpcClient.getNodeTime();
}

function getGlobalFunc(funcName: string) {
  if (typeof window !== 'undefined' && typeof window[funcName] === 'function') {
    // browser
    return window[funcName];
  } else if (
    typeof global !== 'undefined' &&
    typeof global[funcName] === 'function'
  ) {
    // node, react native
    return global[funcName];
  }

  throw new Error(`Can not found global function ${funcName}`);
}

function createWrapperAsyncFunc(funcName) {
  const globalFunc = getGlobalFunc(funcName);

  return async function (data) {
    return globalFunc(data);
  };
}

function createWrapperSyncFunc(funcName) {
  const globalFunc = getGlobalFunc(funcName);

  return function (data) {
    return globalFunc(data);
  };
}

function createWrapperRequiredTimeFunc(funcName) {
  const globalFunc = getGlobalFunc(funcName);

  return async function (data) {
    const time = await getNodeTime();
    return globalFunc(data, time);
  };
}

function getWrapperFunc(funcName) {
  let func;
  if (requiredTimeFuncName.includes(funcName)) {
    func = createWrapperRequiredTimeFunc(funcName);
  } else if (asyncFuncName.includes(funcName)) {
    func = createWrapperAsyncFunc(funcName);
    console.log('Func from async: ', func);
  } else if (syncFuncName.includes(funcName)) {
    func = createWrapperSyncFunc(funcName);
  }

  if (typeof func === 'function') {
    wasmFuncs[funcName] = func;
    return func;
  } else {
    console.log(`Not found wasm function name ${funcName}`);
    throw new Error('Invalid wasm function name');
  }
}

const wasmFuncs = new Proxy(
  {
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
    getSignPublicKey: null,
  },
  {
    get: function (obj, prop: string) {
      if (
        [...requiredTimeFuncName, ...asyncFuncName, ...syncFuncName].includes(
          prop
        )
      ) {
        return (obj as { [key: string]: any })[prop] || getWrapperFunc(prop);
      }

      return (obj as { [key: string]: any })[prop];
    },
    set: function (obj, prop: string, value) {
      if (typeof value === 'function') {
        (obj as { [key: string]: any })[prop] = value;
      } else {
        throw new Error(`${prop} must be a function`);
      }

      return true;
    },
  }
);

export default wasmFuncs;

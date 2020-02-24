type GoMethod = (data: string) => string;
type MethodName = 'deriveSerialNumber'|'randomScalars'|'initPrivacyTx'|'initPrivacyTokenTx'|'initBurningRequestTx'|'initWithdrawRewardTx'|'staking'|
'generateBLSKeyPairFromSeed'|'initPRVContributionTx'|'initPTokenContributionTx'|'initPRVTradeTx'|'initPTokenTradeTx'|'withdrawDexTx'|
'hybridDecryptionASM'|'hybridEncryptionASM'|'stopAutoStaking'|'scalarMultBase'|'generateKeyFromSeed';
type GoMethods = {
  [ K in MethodName]: GoMethod
};

export const GO_METHOD_NAMES = [
  'deriveSerialNumber',
  'randomScalars',
  'initPrivacyTx',
  'initPrivacyTokenTx',
  'initBurningRequestTx',
  'initWithdrawRewardTx',
  'staking',
  'generateBLSKeyPairFromSeed',
  'initPRVContributionTx',
  'initPTokenContributionTx',
  'initPRVTradeTx',
  'initPTokenTradeTx',
  'withdrawDexTx',
  'hybridDecryptionASM',
  'hybridEncryptionASM',
  'stopAutoStaking',
  'scalarMultBase',
  'generateKeyFromSeed'
];

export function implementGoMethodManually(param: GoMethods) {
  GO_METHOD_NAMES.forEach((methodName:MethodName) => {
    (global as { [key: string]: any })[methodName] = param[methodName];
  });
}
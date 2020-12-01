declare type GoMethod = (data: string) => string;
declare type MethodName = 'deriveSerialNumber' | 'randomScalars' | 'initPrivacyTx' | 'initPrivacyTokenTx' | 'initBurningRequestTx' | 'initWithdrawRewardTx' | 'staking' | 'generateBLSKeyPairFromSeed' | 'initPRVContributionTx' | 'initPTokenContributionTx' | 'initPRVTradeTx' | 'initPTokenTradeTx' | 'withdrawDexTx' | 'hybridDecryptionASM' | 'hybridEncryptionASM' | 'stopAutoStaking' | 'scalarMultBase' | 'generateKeyFromSeed';
declare type GoMethods = {
    [K in MethodName]: GoMethod;
};
export declare const GO_METHOD_NAMES: string[];
export declare function implementGoMethodManually(param: GoMethods): void;
export {};
//# sourceMappingURL=implement.d.ts.map
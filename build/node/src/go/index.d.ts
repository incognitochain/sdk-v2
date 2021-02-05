export { implementGoMethodManually, GO_METHOD_NAMES } from "./implement";
export declare function implementGoMethodUseWasm(): Promise<any>;
declare const wasmFuncs: {
    deriveSerialNumber: any;
    initPrivacyTx: any;
    randomScalars: any;
    staking: any;
    stopAutoStaking: any;
    initPrivacyTokenTx: any;
    withdrawDexTx: any;
    initPTokenTradeTx: any;
    initPRVTradeTx: any;
    initPTokenContributionTx: any;
    initPRVContributionTx: any;
    initWithdrawRewardTx: any;
    initBurningRequestTx: any;
    generateKeyFromSeed: any;
    scalarMultBase: any;
    hybridEncryptionASM: any;
    hybridDecryptionASM: any;
    generateBLSKeyPairFromSeed: any;
    getSignPublicKey: any;
    parseNativeRawTx: any;
    parsePrivacyTokenRawTx: any;
};
export default wasmFuncs;
//# sourceMappingURL=index.d.ts.map
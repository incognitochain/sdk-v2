export declare const ERROR_CODE: {
    NOT_ENOUGH_COIN: string;
    INVALID_MNEMONIC: string;
    UTXO: string;
};
export declare const ERROR_MESSAGE: any;
declare class SDKError extends Error {
    message: string;
    code: string;
    constructor(code: string);
}
export default SDKError;
//# sourceMappingURL=error.d.ts.map
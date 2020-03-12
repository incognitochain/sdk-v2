export declare function getKeyBytes(keyStr: string): {
    keyType: number;
    keyBytes: Uint8Array;
};
export declare function extractPaymentAddressKey(keyBytes: KeyBytes): {
    publicKeyBytes: Uint8Array;
    transmissionKeyBytes: Uint8Array;
};
export declare function extractPrivateKey(keyBytes: KeyBytes): {
    depth: number;
    childNumber: Uint8Array;
    chainCode: Uint8Array;
    keyLength: number;
};
export declare function extractViewingKey(keyBytes: KeyBytes): {
    publicKeyBytes: Uint8Array;
    receivingKeyBytes: Uint8Array;
};
//# sourceMappingURL=key.d.ts.map
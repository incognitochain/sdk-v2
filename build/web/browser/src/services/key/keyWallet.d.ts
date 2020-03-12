import PrivateKeyModel from "../../models/key/privateKey";
import PaymentAddressKeyModel from "../../models/key/paymentAddress";
import ViewingKeyModel from "../../models/key/viewingKey";
import KeyWalletModel from "../../models/key/keyWallet";
declare type AllKeyModelType = PrivateKeyModel | PaymentAddressKeyModel | ViewingKeyModel;
declare type KeyTypeString = 'PRIVATE_KEY' | 'PAYMENT_ADDRESS' | 'PUBLIC_KEY' | 'VIEWING_KEY';
export declare function serializeKey(key: AllKeyModelType, depth: KeyWalletDepth, childNumber: KeyWalletChildNumber, chainCode: KeyWalletChainCode): Uint8Array;
export declare function deserializePrivateKeyBytes(bytes: KeyBytes): {
    depth: KeyWalletDepth;
    childNumber: KeyWalletChildNumber;
    chainCode: KeyWalletChainCode;
    privateKey: PrivateKeyModel;
};
export declare function deserializePaymentAddressKeyBytes(bytes: KeyBytes): PaymentAddressKeyModel;
export declare function deserializeViewingKeyBytes(bytes: KeyBytes): ViewingKeyModel;
export declare function deserializePublicKeyBytes(bytes: KeyBytes): KeyBytes;
export declare function base58CheckSerialize(key: AllKeyModelType, depth: KeyWalletDepth, childNumber: KeyWalletChildNumber, chainCode: KeyWalletChainCode): string;
export declare function base58CheckDeserialize(keyStr: string): {
    type: KeyTypeString;
    key: Uint8Array | PaymentAddressKeyModel | ViewingKeyModel | {
        depth: number;
        childNumber: Uint8Array;
        chainCode: Uint8Array;
        privateKey: PrivateKeyModel;
    };
};
export declare function getIntermediary(childIndex: number, keyWalletChainCode: KeyWalletChainCode): any;
export declare function generateChildKeyData(childIndex: number, keyWalletDepth: KeyWalletDepth, keyWalletChainCode: KeyWalletChainCode): Promise<{
    childNumber: Uint8Array;
    chainCode: Uint8Array;
    depth: number;
    keySet: import("../../models/key/accountKeySet").default;
}>;
export declare function getBackupData(keyWallet: KeyWalletModel): {
    chainCode: number[];
    childNumber: number[];
    depth: number;
    keySet: {
        publicKeyBytes: number[];
        transmissionKeyBytes: number[];
        privateKeyBytes: number[];
        receivingKeyBytes: number[];
    };
};
export declare function restoreKeyWalletFromBackupData(data: any): KeyWalletModel;
export {};
//# sourceMappingURL=keyWallet.d.ts.map
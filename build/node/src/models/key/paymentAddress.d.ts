import BaseKeyModel from "./baseKey";
declare class PaymentAddressKeyModel extends BaseKeyModel {
    publicKeyBytes: KeyBytes;
    transmissionKeyBytes: KeyBytes;
    constructor();
    toBytes(): Uint8Array;
}
export default PaymentAddressKeyModel;
//# sourceMappingURL=paymentAddress.d.ts.map
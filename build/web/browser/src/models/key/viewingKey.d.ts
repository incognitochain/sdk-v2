import BaseKeyModel from "./baseKey";
declare class ViewingKeyModel extends BaseKeyModel {
    publicKeyBytes: Uint8Array;
    receivingKeyBytes: Uint8Array;
    constructor();
    toBytes(): Uint8Array;
}
export default ViewingKeyModel;
//# sourceMappingURL=viewingKey.d.ts.map
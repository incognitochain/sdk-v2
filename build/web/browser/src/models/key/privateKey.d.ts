import BaseKeyModel from "./baseKey";
declare class PrivateKeyModel extends BaseKeyModel {
    privateKeyBytes: Uint8Array;
    constructor(privateKeyBytes: Uint8Array);
}
export default PrivateKeyModel;
//# sourceMappingURL=privateKey.d.ts.map
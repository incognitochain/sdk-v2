import BaseModel from "../baseModel";
import PrivateKeyModel from "./privateKey";
import PaymentAddressKeyModel from "./paymentAddress";
import ViewingKeyModel from "./viewingKey";
interface AccountKeySetParam {
    privateKey: PrivateKeyModel;
    paymentAddress: PaymentAddressKeyModel;
    viewingKey: ViewingKeyModel;
}
declare class AccountKeySetModel extends BaseModel {
    privateKey: PrivateKeyModel;
    paymentAddress: PaymentAddressKeyModel;
    viewingKey: ViewingKeyModel;
    privateKeySerialized: string;
    viewingKeySerialized: string;
    paymentAddressKeySerialized: string;
    constructor({ privateKey, paymentAddress, viewingKey }: AccountKeySetParam);
    get publicKeySerialized(): string;
    get publicKeyCheckEncode(): string;
    get miningSeedKey(): number[];
    get validatorKey(): string;
}
export default AccountKeySetModel;
//# sourceMappingURL=accountKeySet.d.ts.map
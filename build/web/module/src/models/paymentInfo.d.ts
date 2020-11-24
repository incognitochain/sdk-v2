import BaseModel from "./baseModel";
interface PaymentInfoModelParam {
    paymentAddress: string;
    amount: string;
    message: string;
}
declare class PaymentInfoModel extends BaseModel {
    paymentAddressStr: string;
    amount: string;
    message: string;
    constructor({ paymentAddress, amount, message }: PaymentInfoModelParam);
}
export default PaymentInfoModel;
//# sourceMappingURL=paymentInfo.d.ts.map
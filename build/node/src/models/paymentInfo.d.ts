import BaseModel from "./baseModel";
interface PaymentInfoModelParam {
    paymentAddress: string;
    amount: number;
    message: string;
}
declare class PaymentInfoModel extends BaseModel {
    paymentAddressStr: string;
    amount: number;
    message: string;
    constructor({ paymentAddress, amount, message }: PaymentInfoModelParam);
}
export default PaymentInfoModel;
//# sourceMappingURL=paymentInfo.d.ts.map
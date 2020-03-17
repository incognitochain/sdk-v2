declare class Validator {
    value: any;
    label: string;
    isRequired: boolean;
    constructor(label: string, value: any);
    _throwError(message: string): void;
    _isDefined(): boolean;
    _onCondition(condition: Function, message: string): this;
    required(message?: string): this;
    maxLength(length: number, message?: string): this;
    string(message?: string): this;
    function(message?: string): this;
    boolean(message?: string): this;
    number(message?: string): this;
    array(message?: string): this;
    min(min: number, message?: string): this;
    max(max: number, message?: string): this;
    largerThan(number: number, message?: string): this;
    lessThan(number: number, message?: string): this;
    inList(list: any[], message?: string): this;
    intergerNumber(message?: string): this;
    paymentAddress(message?: string): this;
    privateKey(message?: string): this;
    shardId(message?: string): this;
    /**
     *
     * @param {number} value amount in nano (must be an integer number)
     * @param {string} message error message
     */
    amount(message?: string): this;
    paymentInfoList(message?: string): this;
}
export default Validator;
//# sourceMappingURL=validator.d.ts.map
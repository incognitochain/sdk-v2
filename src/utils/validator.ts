// TODO: Update it

import { getKeyBytes } from "./key";
import { PaymentAddressType, PriKeyType } from "@src/constants/wallet";

function isPaymentAddress(paymentAddrStr: string) {
  try {
    const { keyType } = getKeyBytes(paymentAddrStr);

    if (keyType === PaymentAddressType) {
      return true;
    }
  } catch (e) {
    return false;
  }

  return false;
}

function isPrivateKey(privateKeyStr: string) {
  try {
    const { keyType } = getKeyBytes(privateKeyStr);

    if (keyType === PriKeyType) {
      return true;
    }
  } catch (e) {
    return false;
  }

  return false;
}


class Validator {
  value: any;
  label: string;
  isRequired: boolean;

  constructor(label: string, value: any) {
    if (!label && typeof label !== 'string') throw new Error('Missing or invalid label');

    this.value = value;
    this.label = label;
    this.isRequired = false;
  }

  _throwError(message: string) {
    throw new Error(`Validating "${this.label}" failed: ${message}. Found ${this.value} (type of ${typeof this.value})`);
  }

  _isDefined() {
    return this.value !== null && this.value !== undefined;
  }

  _onCondition(condition: Function, message: string) {
    if (((!this.isRequired && this._isDefined()) || this.isRequired) && !condition()) {
      this._throwError(message);
    }

    return this;
  }

  required(message = 'Required') {
    this.isRequired = true;
    return this._onCondition(() => this._isDefined(), message);
  }

  maxLength(length: number, message?: string) {
    return this._onCondition(() => this.value.length <= length, message || `Max length is ${length}`);
  }

  string(message = 'Must be string') {
    return this._onCondition(() => typeof this.value === 'string', message);
  }

  function(message = 'Must be a function') {
    return this._onCondition(() => typeof this.value === 'function', message);
  }

  boolean(message = 'Must be boolean') {
    return this._onCondition(() => typeof this.value === 'boolean', message);
  }

  number(message = 'Must be number') {
    return this._onCondition(() => Number.isFinite(this.value), message);
  }

  array(message = 'Must be array') {
    return this._onCondition(() => this.value instanceof Array, message);
  }

  min(min: number, message?: string) {
    new Validator('min', min).required().number();

    return this._onCondition(() => this.value >= min, message || `Minimum is ${min}`);
  }

  max(max: number, message?: string) {
    new Validator('max', max).required().number();

    return this._onCondition(() => this.value <= max, message || `Maximum is ${max}`);
  }

  largerThan(number: number, message?: string) {
    new Validator('number', number).required().number();

    return this._onCondition(() => this.value > number, message || `Must be larger than ${number}`);
  }

  lessThan(number: number, message?: string) {
    new Validator('number', number).required().number();

    return this._onCondition(() => this.value < number, message || `Must be less than ${number}`);
  }

  inList(list: any[], message = 'Must be in provided list') {
    new Validator('list', list).required().array();

    message = `Must be one of ${JSON.stringify(list)}`;
    return this._onCondition(() => list.includes(this.value), message);
  }

  intergerNumber(message = 'Must be an interger number') {
    return this._onCondition(() => Number.isInteger(this.value), message);
  }

  paymentAddress(message = 'Invalid payment address') {
    return this._onCondition(() => this.string() && isPaymentAddress(this.value), message);
  }

  privateKey(message = 'Invalid private key') {
    return this._onCondition(() => this.string() && isPrivateKey(this.value), message);
  }

  shardId(message = 'Shard ID must be between 0 to 7') {
    return this._onCondition(() => this.intergerNumber() && this.inList([0, 1, 2, 3, 4, 5, 6, 7]), message);
  }

  /**
   *
   * @param {number} value amount in nano (must be an integer number)
   * @param {string} message error message
   */
  amount(message = 'Invalid amount') {
    return this._onCondition(() => (this.string() && this.value >= 0), message);
  }

  paymentInfoList(message = 'Invalid paymentInfoList, must be array of payment info "{ paymentAddressStr: string, amount: number, message: string }" (max 30 payment info)') {
    return this._onCondition(() => {
      if (!(this.value instanceof Array) || this.value.length === 0 || this.value.length > 30) return false;
      return this.value.every(paymentInfo => {
        new Validator('payment info', paymentInfo).required();

        const { paymentAddressStr, amount, message } = paymentInfo;

        new Validator('payment info paymentAddressStr', paymentAddressStr).required().paymentAddress();
        new Validator('payment info amount', amount).required().amount();
        new Validator('payment info message', message).required().string();
        return true;
      });
    }, message);
  }
}

export default Validator;

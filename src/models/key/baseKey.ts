import BaseModel from '../baseModel';

type KeyType = number;

class BaseKeyModel extends BaseModel {
  keyType: KeyType;

  constructor() {
    super();

    this.keyType = null;
  }
}

export default BaseKeyModel;
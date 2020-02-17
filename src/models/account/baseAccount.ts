import BaseModel from '../baseModel';

interface BaseAccountModelParam {
  key: object,
  name: string,
};

class BaseAccountModel extends BaseModel {
  name: string;
  key: object;

  constructor({ name, key } : BaseAccountModelParam) {
    super();

    this.name = name;
    this.key = key;
  }
}

export default BaseAccountModel;
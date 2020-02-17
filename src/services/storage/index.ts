interface ImplementInterface {
  setMethod: Function;
  getMethod: Function;
  removeMethod: Function;
  namespace: string;
};

class Storage {
  namespace: string;
  setMethod: Function;
  getMethod: Function;
  removeMethod: Function;

  constructor(namespace?: string) {
    this.namespace = namespace;
    this.setMethod = null;
    this.getMethod = null;
    this.removeMethod = null;
  }

  implement({ setMethod, getMethod, removeMethod, namespace } : ImplementInterface) {
    this.setMethod = setMethod;
    this.getMethod = getMethod;
    this.removeMethod = removeMethod;
    this.namespace = namespace;
  }

  _getKey(key: string) {
    return this.namespace ? `${this.namespace}-${key}` : key;
  }

  async set(key: string, data: any) {
    const dataStr = JSON.stringify(data);
    return await this.setMethod(this._getKey(key), dataStr);
  }

  async get(key: string) {
    const dataStr =  await this.getMethod(this._getKey(key));
    return JSON.parse(dataStr);
  }

  async remove(key: string) {
    return await this.removeMethod(this._getKey(key));
  }
}

export default new Storage();
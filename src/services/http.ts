import Axios from 'axios';

interface AuthInterface {
  username: string,
  password: string
};

export default class RPCHttpService {
  auth: AuthInterface;
  url: string;
  
  constructor(url = ENV.LOCAL_CHAIN_URL, username: string, password: string) {
    this.auth = {
      username: username,
      password: password,
    };
    this.url = url;
  }

  postRequest = async (data: any) => {
    const response = await Axios.post(this.url, data, {
      auth: this.auth, headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        'Access-Control-Allow-Headers': 'Content-Type, Cache-Control, X-Requested-With, X-CSRF-Token, Discourse-Visible, User-Api-Key, User-Api-Client-Id, *',
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, PUT, GET, OPTIONS, DELETE',
      }
    });
    return response;
  }
}

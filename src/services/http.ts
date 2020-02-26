import Axios from 'axios';
import { getConfig } from '@src/config';

interface AuthInterface {
  username: string,
  password: string
};

export default class RPCHttpService {
  auth: AuthInterface;
  url: string;
  
  constructor(username: string, password: string) {
    this.auth = {
      username: username,
      password: password,
    };
  }

  postRequest = async (data: any) => {
    const response = await Axios.post(getConfig().chainURL, data, {
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

interface AuthInterface {
    username: string;
    password: string;
}
export default class RPCHttpService {
    auth: AuthInterface;
    url: string;
    constructor(url: string, username: string, password: string);
    postRequest: (data: any) => Promise<import("axios").AxiosResponse<any>>;
}
export {};
//# sourceMappingURL=http.d.ts.map
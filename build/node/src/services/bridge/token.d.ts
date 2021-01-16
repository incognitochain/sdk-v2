import PrivacyTokenApiModel from "../../models/bridge/privacyTokenApi";
export declare const getBridgeTokenList: () => Promise<any[] | (import("axios").AxiosResponse<any> & any[])>;
export declare const getChainTokenList: () => Promise<any[] | (import("axios").AxiosResponse<any> & any[])>;
export declare const getEstFeeFromChain: (data: {
    Prv: number;
    TokenID: string;
}) => Promise<any>;
export declare function getPrivacyTokenList(_bridgeTokens?: any[], _chainTokens?: any[]): Promise<PrivacyTokenApiModel[]>;
//# sourceMappingURL=token.d.ts.map
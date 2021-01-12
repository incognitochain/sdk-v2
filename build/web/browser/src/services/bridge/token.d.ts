import PrivacyTokenApiModel from "../../models/bridge/privacyTokenApi";
export declare const getBridgeTokenList: () => Promise<any[] | (import("axios").AxiosResponse<any> & any[])>;
export declare const getChainTokenList: () => Promise<any[] | (import("axios").AxiosResponse<any> & any[])>;
/**
 * All tokens in Incognito chain with bridge info (if any)
 */
export declare function getPrivacyTokenList(_bridgeTokens?: any[], _chainTokens?: any[]): Promise<PrivacyTokenApiModel[]>;
//# sourceMappingURL=token.d.ts.map
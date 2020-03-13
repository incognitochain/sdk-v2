import http from './apiHttp';
import BridgeTokenApiModel from '@src/models/api/bridgeTokenApi';
import ChainTokenApiModel from '@src/models/api/chainTokenApi';
import PrivacyTokenApiModel from '@src/models/api/privacyTokenApi';

/**
 * All bridge tokens
 */
function getBridgeTokenList() {
  return http.get('ptoken/list')
    .then(res => {
      if (res instanceof Array) {
        return res.map(token => new BridgeTokenApiModel(token));
      }
      
      return null;
    });
}

/**
 * All tokens in Incognito chain
 */
function getChainTokenList() {
  return http.get('pcustomtoken/list-from-chain')
    .then((res: any) => {
      const tokens = res?.Tokens;
      if (tokens instanceof Array) {
        return tokens.map(token => new ChainTokenApiModel(token));
      }
      
      return null;
    });
}

/**
 * All tokens that were merged from bridge tokens & tokens in incognito chain
 */
export async function getPrivacyTokenList() {
  const [bridgeTokens, chainTokens] = await Promise.all([
    getBridgeTokenList(),
    getChainTokenList()
  ]);

  // merging 
  const privacyTokens = chainTokens.map(chainToken => {
    const bridgeToken = bridgeTokens.find(bridgeToken => bridgeToken.tokenId === chainToken.tokenId);
    return new PrivacyTokenApiModel({ chainTokenInfo: chainToken, bridgeTokenInfo: bridgeToken });
  });

  return privacyTokens;
}
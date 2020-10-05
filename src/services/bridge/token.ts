import http from './bridgeHttp';
import BridgeTokenApiModel from '@src/models/bridge/bridgeTokenApi';
import ChainTokenApiModel from '@src/models/bridge/chainTokenApi';
import PrivacyTokenApiModel from '@src/models/bridge/privacyTokenApi';
import _ from 'lodash';

/**
 * All tokens have bridge info
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
 * All tokens in Incognito chain with bridge info (if any)
 */
export async function getPrivacyTokenList() {
  const [bridgeTokens, chainTokens] = await Promise.all([
    getBridgeTokenList(),
    getChainTokenList()
  ]);

  // merging 
  const privacyTokens = chainTokens.map(chainToken => {
    const bridgeToken = _.remove(bridgeTokens, (bridgeToken => bridgeToken.tokenId === chainToken.tokenId));
    return new PrivacyTokenApiModel({ chainTokenInfo: chainToken, bridgeTokenInfo: bridgeToken && bridgeToken[0] });
  });

  return privacyTokens.concat(bridgeTokens.map(bridgeToken => new PrivacyTokenApiModel({ chainTokenInfo: null, bridgeTokenInfo: bridgeToken })));
}

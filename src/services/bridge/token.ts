import { http } from '@src/services/http';
import BridgeTokenApiModel from '@src/models/bridge/bridgeTokenApi';
import ChainTokenApiModel from '@src/models/bridge/chainTokenApi';
import PrivacyTokenApiModel from '@src/models/bridge/privacyTokenApi';
import remove from 'lodash/remove';

export const getBridgeTokenList = () => {
  return http.get('ptoken/list').then((res) => {
    if (res instanceof Array) {
      return res;
    }
    return [];
  });
};

export const getChainTokenList = () => {
  return http.get('pcustomtoken/list').then((res) => {
    if (res instanceof Array) {
      return res;
    }
    return [];
  });
};

/**
 * All tokens in Incognito chain with bridge info (if any)
 */
export async function getPrivacyTokenList(
  _bridgeTokens?: any[],
  _chainTokens?: any[]
) {
  let bridgeTokens: any[] = [];
  let chainTokens: any[] = [];
  if (!_bridgeTokens || !chainTokens) {
    const [bridgeTokensDt, chainTokensDt] = await Promise.all([
      getBridgeTokenList(),
      getChainTokenList(),
    ]);
    bridgeTokens = bridgeTokensDt.map(
      (token) => new BridgeTokenApiModel(token)
    );
    chainTokens = chainTokensDt.map((token) => new ChainTokenApiModel(token));
  } else {
    bridgeTokens = _bridgeTokens.map((token) => new BridgeTokenApiModel(token));
    chainTokens = _chainTokens.map((token) => new ChainTokenApiModel(token));
  }

  // merging
  const privacyTokens = chainTokens.map((chainToken) => {
    const bridgeToken = remove(
      bridgeTokens,
      (bridgeToken) => bridgeToken.tokenId === chainToken.tokenId
    );
    return new PrivacyTokenApiModel({
      chainTokenInfo: chainToken,
      bridgeTokenInfo: bridgeToken && bridgeToken[0],
    });
  });
  const mergeTokens = privacyTokens.concat(
    bridgeTokens.map(
      (bridgeToken) =>
        new PrivacyTokenApiModel({
          chainTokenInfo: null,
          bridgeTokenInfo: bridgeToken,
        })
    )
  );
  return mergeTokens;
}

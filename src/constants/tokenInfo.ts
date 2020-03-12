const NATIVE_TOKEN = {
  tokenId: '0000000000000000000000000000000000000000000000000000000000000004',
  name: 'Privacy',
  symbol: 'PRV'
};

const BRIDGE_PRIVACY_TOKEN = {
  TYPE: {
    COIN: 0,
    TOKEN: 1 // including ERC20, BEP1, BEP2,...
  },
  CURRENCY_TYPE: {
    ETH: 1,
    BTC: 2,
    ERC20: 3,
    BNB: 4,
    BNB_BEP2: 5,
    USD: 6
  }
};

export default {
  NATIVE_TOKEN,
  BRIDGE_PRIVACY_TOKEN
};
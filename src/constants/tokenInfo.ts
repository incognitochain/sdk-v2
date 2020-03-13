const NATIVE_TOKEN = {
  tokenId: '0000000000000000000000000000000000000000000000000000000000000004',
  name: 'Privacy',
  symbol: 'PRV'
};

const BRIDGE_PRIVACY_TOKEN = {
  DEFINED_TOKEN_ID: {
    // use to detect some special tokens (maybe different between testnet & mainnet)
    ETHEREUM: 'ffd8d42dc40a8d166ea4848baf8b5f6e912ad79875f4373070b59392b1756c8f'
  },
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
  },
  ADDRESS_TYPE: {
    DEPOSIT: 1,
    WITHDRAW: 2
  },
};

export default {
  NATIVE_TOKEN,
  BRIDGE_PRIVACY_TOKEN
};
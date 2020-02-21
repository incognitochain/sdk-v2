const TxNormalType             = 'n';  // normal tx(send and receive coin)
const TxSalaryType             = 's';  // salary tx(gov pay salary for block producer)
const TxCustomTokenType        = 't';  // token  tx with no supporting privacy
const TxCustomTokenPrivacyType = 'tp'; // token  tx with supporting privacy

const CustomTokenInit = 0;
const CustomTokenTransfer = 1;
const TxVersion = 1;

const STAKING_TYPES = {
  SHARD: 0,
  BEACON: 1
};

// todo: 0xkraken
// NumUTXO must be 255
// because tx zise is exceed 100kb with NumUTXO = 255
const MaxInputNumberForDefragment = 50;

const MaxInfoSize = 512;

export {TxNormalType, TxSalaryType, TxCustomTokenType, TxCustomTokenPrivacyType, CustomTokenInit, CustomTokenTransfer, TxVersion, MaxInputNumberForDefragment, MaxInfoSize, STAKING_TYPES};
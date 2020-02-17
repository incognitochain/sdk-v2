const MAX_EXP = 64;
const CM_RING_SIZE = 8; 
const CM_RING_SIZE_EXP = 3;

// size of zero knowledge proof corresponding one input
const ONE_OF_MANY_PROOF_SIZE = 704;
const SN_PRIVACY_PROOF_SIZE = 320;
const SN_NO_PRIVACY_PROOF_SIZE = 192;


const SK = 0x00;
const VALUE = 0x01;
const SND = 0x02;
const SHARD_ID = 0x03;
const RAND = 0x04;
const FULL = 0x05;

const ED25519_KEY_SIZE = 32;

const UINT64_SIZE = 8; // bytes
const PC_CAPACITY = 5;

export {
  CM_RING_SIZE,
  CM_RING_SIZE_EXP,
  MAX_EXP,
  ONE_OF_MANY_PROOF_SIZE,
  SN_PRIVACY_PROOF_SIZE,
  SN_NO_PRIVACY_PROOF_SIZE,

  ED25519_KEY_SIZE,
  PC_CAPACITY,
  SK,
  VALUE,
  SND,
  SHARD_ID,
  RAND,
  FULL,
  UINT64_SIZE,
};
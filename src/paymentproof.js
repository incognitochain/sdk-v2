import { 
  INPUT_COINS_NO_PRIVACY_SIZE,
  OUTPUT_COINS_NO_PRIVACY_SIZE,
  INPUT_COINS_PRIVACY_SIZE,
  OUTPUT_COINS_PRIVACY_SIZE,
  ED25519_KEY_SIZE,
} from '@src/constants/constants';
import {
  UINT64_SIZE,
  CM_RING_SIZE,
  ONE_OF_MANY_PROOF_SIZE,
  SN_PRIVACY_PROOF_SIZE,
  SN_NO_PRIVACY_PROOF_SIZE,
  MAX_EXP
} from './privacy/constants';

import {pad} from './privacy/utils';

function estimateMultiRangeProofSize(nOutput){
  return parseInt((nOutput + 2*(Math.log2(MAX_EXP*pad(nOutput))) + 5)*ED25519_KEY_SIZE + 5* ED25519_KEY_SIZE + 2);
}

function estimateProofSize(nInput, nOutput, hasPrivacy) {
  if (!hasPrivacy) {
    let flagSize = 14 + 2 * nInput + nOutput;
    let sizeSNNoconstantsProof = nInput * SN_NO_PRIVACY_PROOF_SIZE;
    let sizeInputCoins = nInput * INPUT_COINS_NO_PRIVACY_SIZE;
    let sizeOutputCoins = nOutput * OUTPUT_COINS_NO_PRIVACY_SIZE;
    let sizeProof = flagSize + sizeSNNoconstantsProof + sizeInputCoins + sizeOutputCoins;
    return sizeProof;
  }
  let flagSize = 14 + 7 * nInput + 4 * nOutput;
  let sizeOneOfManyProof = nInput * ONE_OF_MANY_PROOF_SIZE;
  let sizeSNPrivacyProof = nInput * SN_PRIVACY_PROOF_SIZE;
  let sizeComOutputMultiRangeProof = estimateMultiRangeProofSize(nOutput);

  let sizeInputCoins = nInput * INPUT_COINS_PRIVACY_SIZE;
  let sizeOutputCoins = nOutput * OUTPUT_COINS_PRIVACY_SIZE;

  let sizeComOutputValue = nOutput * ED25519_KEY_SIZE;
  let sizeComOutputSND = nOutput * ED25519_KEY_SIZE;
  let sizeComOutputShardID = nOutput * ED25519_KEY_SIZE;

  let sizeComInputSK = ED25519_KEY_SIZE;
  let sizeComInputValue = nInput * ED25519_KEY_SIZE;
  let sizeComInputSND = nInput * ED25519_KEY_SIZE;
  let sizeComInputShardID = ED25519_KEY_SIZE;

  let sizeCommitmentIndices = nInput * CM_RING_SIZE * UINT64_SIZE;

  let sizeProof = sizeOneOfManyProof + sizeSNPrivacyProof +
      sizeComOutputMultiRangeProof + sizeInputCoins + sizeOutputCoins +
      sizeComOutputValue + sizeComOutputSND + sizeComOutputShardID +
      sizeComInputSK + sizeComInputValue + sizeComInputSND + sizeComInputShardID +
      sizeCommitmentIndices + flagSize;
  return sizeProof;
}

export { estimateProofSize };

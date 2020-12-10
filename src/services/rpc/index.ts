import httpService from '@src/services/rpc/rpcHttp';
import { checkDecode, checkEncode } from '@src/utils/base58';
import { stringToBytes, bytesToString } from '@src/privacy/utils';
import { ENCODE_VERSION } from '@src/constants/constants';
import { PRVIDSTR, PDEPOOLKEY } from '@src/constants/wallet';
import CoinModel, { CoinRawData } from '@src/models/coin';

async function sendRequest(method: string, params: any): Promise<any> {
  const data = {
    jsonrpc: '1.0',
    method: method,
    params: params,
    id: 1,
  };

  return await httpService.post('', data);
}

class RpcClient {
  getOutputCoin = async (
    paymentAdrr: string,
    viewingKey = '',
    tokenID: string = null
  ) => {
    const result: any = await sendRequest('listoutputcoins', [
      0,
      999999,
      [
        {
          PaymentAddress: paymentAdrr,
          ReadonlyKey: viewingKey,
        },
      ],
      ...(tokenID ? [tokenID] : []),
    ]);

    const outCoinsMap = result.Outputs;

    let outCoins: object[];
    for (let key in outCoinsMap) {
      if (key == paymentAdrr || (viewingKey !== '' && key == viewingKey)) {
        outCoins = outCoinsMap[key];
        break;
      }
    }

    return {
      outCoins: outCoins?.map((data: CoinRawData) => new CoinModel(data)),
    };
  };

  // hasSerialNumber return true if serial number existed in database
  hasSerialNumber = async (
    paymentAddr: string,
    serialNumberStrs: any,
    tokenID: string | null = null
  ) => {
    const result: boolean[] = await sendRequest('hasserialnumbers', [
      paymentAddr,
      serialNumberStrs,
      ...(tokenID ? [tokenID] : []),
    ]);

    return result;
  };

  // hasSNDerivator return true if snd existed in database
  hasSNDerivator = async (
    paymentAddr: string,
    snds: any,
    tokenID: any = null
  ) => {
    const existed = await sendRequest('hassnderivators', [
      paymentAddr,
      snds,
      ...(tokenID ? [tokenID] : []),
    ]);

    return { existed };
  };

  // randomCommitmentsProcess randoms list commitment for proving
  randomCommitmentsProcess = async (
    paymentAddr: any,
    inputCoinStrs: any,
    tokenID: any = null
  ) => {
    const result: any = await sendRequest('randomcommitments', [
      paymentAddr,
      inputCoinStrs,
      ...(tokenID ? [tokenID] : []),
    ]);

    const commitmentStrs = result.Commitments;

    return {
      commitmentIndices: result.CommitmentIndices,
      commitmentStrs: commitmentStrs,
      myCommitmentIndices: result.MyCommitmentIndexs,
    };
  };

  sendRawTx = async (serializedTxJson: any) => {
    const result: any = await sendRequest('sendtransaction', [
      serializedTxJson,
    ]);

    return {
      txId: result.TxID,
    };
  };

  // for tx custom token
  sendRawTxCustomToken = async (tx: any) => {
    // hide private key for signing
    delete tx.sigPrivKey;

    // convert tx to json
    let txJson = JSON.stringify(tx.convertTxCustomTokenToByte());

    let txBytes = stringToBytes(txJson);

    // base58 check encode tx json
    let serializedTxJson = checkEncode(txBytes, ENCODE_VERSION);
    // console.log("tx json serialize: ", serializedTxJson);

    const result: any = await sendRequest('sendrawcustomtokentransaction', [
      serializedTxJson,
    ]);

    return {
      txId: result.TxID,
    };
  };

  // for tx custom token
  sendRawTxCustomTokenPrivacy = async (serializedTxJson: any) => {
    const result: any = await sendRequest(
      'sendrawprivacycustomtokentransaction',
      [serializedTxJson]
    );

    return {
      txId: result.TxID,
    };
  };

  listCustomTokens = async () => {
    const result: any = await sendRequest('listcustomtoken', []);

    return {
      listCustomToken: result.ListCustomToken,
    };
  };

  listPrivacyCustomTokens = async () => {
    const result: any = await sendRequest('listprivacycustomtoken', []);

    let pTokens = result.ListCustomToken;
    // decode txinfo for each ptoken
    for (let i = 0; i < pTokens.length; i++) {
      if (pTokens[i].TxInfo !== undefined && pTokens[i].TxInfo !== '') {
        let infoDecode = checkDecode(pTokens[i].TxInfo).bytesDecoded;
        let infoDecodeStr = bytesToString(infoDecode);
        pTokens[i].TxInfo = infoDecodeStr;
      }
    }

    return pTokens;
  };

  getUnspentCustomToken = async (
    paymentAddrSerialize: any,
    tokenIDStr: any
  ) => {
    const result: any = await sendRequest('listunspentcustomtoken', [
      paymentAddrSerialize,
      tokenIDStr,
    ]);

    return (
      result && {
        listUnspentCustomToken: result,
      }
    );
  };

  getEstimateFeePerKB = async (
    paymentAddrSerialize: any,
    tokenIDStr: any = null
  ) => {
    const result: any = await sendRequest('estimatefeewithestimator', [
      -1,
      paymentAddrSerialize,
      8,
      tokenIDStr,
    ]);

    return {
      unitFee: parseInt(result.EstimateFeeCoinPerKb),
    };
  };

  getTransactionByHash = async (txHashStr: any) => {
    const result: any = await sendRequest('gettransactionbyhash', [txHashStr]);

    return result
      ? {
          isInBlock: result.IsInBlock,
          isInMempool: result.IsInMempool,
          err: <any>null,
        }
      : {
          isInBlock: false,
          isInMempool: false,
        };
  };

  getStakingAmount = async (type: any) => {
    const result: any = await sendRequest('getstackingamount', [type]);
    return {
      res: Number(result),
    };
  };

  getActiveShard = async () => {
    const result: any = await sendRequest('getactiveshards', []);

    return {
      shardNumber: parseInt(result),
    };
  };

  getMaxShardNumber = async () => {
    const result: any = await sendRequest('getmaxshardsnumber', []);

    return {
      shardNumber: parseInt(result),
    };
  };

  hashToIdenticon = async (hashStrs: any) => {
    const result: any = await sendRequest('hashtoidenticon', hashStrs);

    return {
      images: result,
    };
  };

  getRewardAmount = async (paymentAddrStr: any) => {
    const result: any = await sendRequest('getrewardamount', [paymentAddrStr]);

    return {
      rewards: result,
    };
  };

  getBeaconBestState = async () => {
    const result: any = await sendRequest('getbeaconbeststate', []);

    return {
      bestState: result,
    };
  };

  getPublicKeyRole = async (publicKey: any) => {
    const result: any = await sendRequest('getpublickeyrole', [publicKey]);

    return {
      status: result,
    };
  };

  getPDEState = async (beaconHeight: any) => {
    const result: any = await sendRequest('getpdestate', [
      {
        BeaconHeight: beaconHeight,
      },
    ]);

    return {
      state: result,
    };
  };

  getPDETradeStatus = async (txId: any) => {
    const result: any = await sendRequest('getpdetradestatus', [
      {
        TxRequestIDStr: txId,
      },
    ]);

    return {
      state: result,
    };
  };

  getPDEContributionStatus = async (pairId: any) => {
    const result: any = await sendRequest('getpdecontributionstatus', [
      {
        ContributionPairID: pairId,
      },
    ]);

    return {
      state: result,
    };
  };

  getPDEContributionStatusV2 = async (pairId: any) => {
    const result: any = await sendRequest('getpdecontributionstatusv2', [
      {
        ContributionPairID: pairId,
      },
    ]);

    return {
      state: result,
    };
  };

  getPDEWithdrawalStatus = async (txId: any) => {
    const result: any = await sendRequest('getpdewithdrawalstatus', [
      {
        TxRequestIDStr: txId,
      },
    ]);

    return {
      state: result,
    };
  };

  getBlockChainInfo = async () => {
    const result: any = await sendRequest('getblockchaininfo', []);

    return result;
  };

  listRewardAmount = async () => {
    const result: any = await sendRequest('listrewardamount', []);

    return result;
  };

  getBeaconBestStateDetail = async () => {
    const result: any = await sendRequest('getbeaconbeststatedetail', []);

    return result;
  };

  getBeaconHeight = async () => {
    const data = await this.getBlockChainInfo();
    return data.BestBlocks['-1'].Height;
  };

  /**
   *
   * @param {string} tokenIDStr1
   * @param {string} tokenIDStr2, default is PRV
   */
  isExchangeRatePToken = async (tokenIDStr1: any, tokenIDStr2 = '') => {
    if (tokenIDStr2 === '') {
      tokenIDStr2 = PRVIDSTR;
    }
    const beaconHeight = await this.getBeaconHeight();
    const pdeStateRes = await this.getPDEState(beaconHeight);
    let tokenIDArray = [tokenIDStr1, tokenIDStr2];
    tokenIDArray.sort();
    let keyValue =
      PDEPOOLKEY +
      '-' +
      beaconHeight +
      '-' +
      tokenIDArray[0] +
      '-' +
      tokenIDArray[1];
    if (
      pdeStateRes.state.PDEPoolPairs[keyValue] !== null &&
      pdeStateRes.state.PDEPoolPairs[keyValue] !== undefined
    ) {
      if (
        tokenIDArray[0] == PRVIDSTR &&
        pdeStateRes.state.PDEPoolPairs[keyValue].Token1PoolValue < 10000 * 1e9
      ) {
        return false;
      }
      if (
        tokenIDArray[1] == PRVIDSTR &&
        pdeStateRes.state.PDEPoolPairs[keyValue].Token2PoolValue < 10000 * 1e9
      ) {
        return false;
      }
      return true;
    }
    return false;
  };

  getTransactionByReceiver = async (paymentAdrr: any, viewingKey: any) => {
    const result: any = await sendRequest('gettransactionbyreceiver', [
      {
        PaymentAddress: paymentAdrr,
        ReadonlyKey: viewingKey,
      },
    ]);

    return {
      receivedTransactions: result.ReceivedTransactions,
    };
  };

  getListPrivacyCustomTokenBalance = async (privateKey: any) => {
    const result: any = await sendRequest('getlistprivacycustomtokenbalance', [
      privateKey,
    ]);

    return result.ListCustomTokenBalance || [];
  };

  getBurningAddress = async (beaconHeight: number = 0) => {
    const result: any = await sendRequest('getburningaddress', [beaconHeight]);

    return result;
  };

  getNodeTime = async () => {
    const data = await sendRequest('getnetworkinfo', '');
    return data.NodeTime;
  };
}

const client = new RpcClient();

// @ts-ignore
global.rpcClient = client;

export default client;

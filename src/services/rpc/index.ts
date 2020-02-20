import RPCHttpService from '@src/services/http';
import { checkDecode, checkEncode } from '@src/utils/base58';
import { stringToBytes, bytesToString } from '@src/privacy/utils';
import { ENCODE_VERSION } from '@src/constants/constants';
import { CustomError, ErrorObject, RPCError } from '@src/errorhandler';
import { PRVIDSTR, PDEPOOLKEY } from '@src/services/wallet/constants';
import CoinModel, { CoinRawData } from '@src/models/coin';

const parseResponse = async (rpcService: RPCHttpService, method: string) => {
  const data = {
    jsonrpc: '1.0',
    method: method,
    params: <any>[],
    id: 1
  };
  let response;

  response = await rpcService.postRequest(data);

  if (response.status !== 200) {
    throw new Error('Can\'t request API ' + data.method);
  } else if (response.data.Error) {
    throw new RPCError(method, response.data.Error);
  }

  return response.data.Result;
};

class RpcClient {
  rpcHttpService: RPCHttpService;

  constructor(url?: string, user?: string, password?: string) {
    this.rpcHttpService = new RPCHttpService(url, user, password);
  }

    getOutputCoin = async (paymentAdrr: string, viewingKey = '', tokenID: string = null) => {
      let data = {
        'jsonrpc': '1.0',
        'method': 'listoutputcoins',
        'params': <any>[
          0,
          999999,
          [{
            'PaymentAddress': paymentAdrr,
            'ReadonlyKey': viewingKey,
          }],
        ],
        'id': 1
      };

      if (tokenID != null) {
        data.params.push(tokenID);
      }

      let response;
      response = await this.rpcHttpService.postRequest(data);

      if (response.status !== 200) {
        throw new Error('Can\'t request API get all output coins');
      } else if (response.data.Error) {
        throw response.data.Error;
      }

      let outCoinsMap = response.data.Result.Outputs;
      let outCoins: object[];
      for (let key in outCoinsMap){
        if (key == paymentAdrr || (viewingKey !== '' && key == viewingKey)){
          outCoins = outCoinsMap[key];
          break;
        }
      }

      return {
        outCoins: outCoins?.map((data: CoinRawData) => new CoinModel(data))
      };
    };

    // hasSerialNumber return true if serial number existed in database
    hasSerialNumber = async (paymentAddr: string, serialNumberStrs: any, tokenID: string | null = null) => {
      const data = {
        'jsonrpc': '1.0',
        'method': 'hasserialnumbers',
        'params': [
          paymentAddr,
          serialNumberStrs,
        ],
        'id': 1
      };

      if (tokenID !== null) {
        data['params'][2] = tokenID;
      }

      let response;
      response = await this.rpcHttpService.postRequest(data);

      if (response.status !== 200) {
        throw new Error('Can\'t request API check has serial number');
      } else if (response.data.Error) {
        throw response.data.Error;
      }

      return response.data.Result;
    };

    // hasSNDerivator return true if snd existed in database
    hasSNDerivator = async (paymentAddr: string, snds: any, tokenID: any = null) => {
      const data = {
        'jsonrpc': '1.0',
        'method': 'hassnderivators',
        'params': [
          paymentAddr,
          snds,
        ],
        'id': 1
      };

      if (tokenID != null) {
        data['params'][2] = tokenID;
      }

      let response;
      response = await this.rpcHttpService.postRequest(data);

      if (response.status !== 200) {
        throw new Error('Can\'t request API check has serial number derivator');
      } else if (response.data.Error) {
        throw response.data.Error;
      }

      return {
        existed: response.data.Result,
      };
    };

    // randomCommitmentsProcess randoms list commitment for proving
    randomCommitmentsProcess = async (paymentAddr: any, inputCoinStrs: any, tokenID : any= null) => {
      const data = {
        'jsonrpc': '1.0',
        'method': 'randomcommitments',
        'params': [
          paymentAddr,
          inputCoinStrs,
        ],
        'id': 1
      };

      if (tokenID != null) {
        data['params'][2] = tokenID;
      }

      let response;
      response = await this.rpcHttpService.postRequest(data);

      if (response.status !== 200) {
        throw new Error('Can\'t request API random commitments');
      } else if (response.data.Error) {
        throw response.data.Error;
      }

      let commitmentStrs = response.data.Result.Commitments;

      // // deserialize commitments
      // let commitments = new Array(commitmentStrs.length);
      // for (let i = 0; i < commitments.length; i++) {
      //   let res = checkDecode(commitmentStrs[i]);

      //   if (res.version !== ENCODE_VERSION) {
      //     throw new Error("Base58 check decode wrong version");
      //   }

      //   commitments[i] = P256.decompress(res.bytesDecoded);
      // }

      return {
        commitmentIndices: response.data.Result.CommitmentIndices,
        commitmentStrs: commitmentStrs,
        myCommitmentIndices: response.data.Result.MyCommitmentIndexs,
      };
    };

    sendRawTx = async (serializedTxJson: any) => {
      const data = {
        'jsonrpc': '1.0',
        'method': 'sendtransaction',
        'params': [
          serializedTxJson,
        ],
        'id': 1
      };

      let response;
      response = await this.rpcHttpService.postRequest(data);

      if (response.status !== 200) {
        throw new Error('Can\'t request API send transaction');
      } else if (response.data.Error) {
        throw response.data.Error;
      }

      console.log('**** SENDING TX SUCCESS, TxID: ', response.data.Result.TxID);
      return {
        txId: response.data.Result.TxID
      };
    };

    // for tx custom token
    sendRawTxCustomToken = async (tx: any) => {
      // hide private key for signing
      delete tx.sigPrivKey;

      // convert tx to json
      let txJson = JSON.stringify(tx.convertTxCustomTokenToByte());
      console.log('txJson: ', txJson);

      let txBytes = stringToBytes(txJson);
      console.log('TxBytes: ', txBytes.join(', '));
      console.log('TxBytes len : ', txBytes.length);

      // base58 check encode tx json
      let serializedTxJson = checkEncode(txBytes, ENCODE_VERSION);
      // console.log("tx json serialize: ", serializedTxJson);

      const data = {
        'jsonrpc': '1.0',
        'method': 'sendrawcustomtokentransaction',
        'params': [
          serializedTxJson,
        ],
        'id': 1
      };

      let response;
      response = await this.rpcHttpService.postRequest(data);

      if (response.status !== 200) {
        throw new Error('Can\'t request API send custom token transaction');
      } else if (response.data.Error) {
        throw response.data.Error;
      }

      console.log('**** SENDING TX SUCCESS****');
      return {
        txId: response.data.Result.TxID
      };
    };

    // for tx custom token
    sendRawTxCustomTokenPrivacy = async (serializedTxJson: any) => {
      const data = {
        'jsonrpc': '1.0',
        'method': 'sendrawprivacycustomtokentransaction',
        'params': [
          serializedTxJson,
        ],
        'id': 1
      };

      let response;
      response = await this.rpcHttpService.postRequest(data);

      if (response.status !== 200) {
        throw new Error('Can\'t request API send privacy custom token transaction');
      } else if (response.data.Error) {
        throw response.data.Error;
      }

      console.log('**** SENDING TX SUCCESS, TxID: ', response.data.Result.TxID);
      return {
        txId: response.data.Result.TxID
      };
    };

    listCustomTokens = async () => {
      const data = {
        'jsonrpc': '1.0',
        'method': 'listcustomtoken',
        'params': <any[]>[],
        'id': 1
      };

      let response;
      try {
        response = await this.rpcHttpService.postRequest(data);
      } catch (e) {
        throw new CustomError(ErrorObject.GetListCustomTokenErr, 'Can\'t request API get custom token list');
      }

      if (response.status !== 200) {
        throw new CustomError(ErrorObject.GetListCustomTokenErr, 'Can\'t request API get custom token list');
      } else if (response.data.Error) {
        throw new CustomError(ErrorObject.GetListCustomTokenErr, response.data.Error.Message);
      }

      return {
        listCustomToken: response.data.Result.ListCustomToken,
      };
    };

    listPrivacyCustomTokens = async () => {
      const data = {
        'jsonrpc': '1.0',
        'method': 'listprivacycustomtoken',
        'params': <any[]>[],
        'id': 1
      };

      let response;
      try {
        response = await this.rpcHttpService.postRequest(data);
      } catch (e) {
        throw new CustomError(ErrorObject.GetListPrivacyTokenErr, 'Can\'t request API get privacy token list');
      }

      if (response.status !== 200) {
        throw new CustomError(ErrorObject.GetListPrivacyTokenErr, 'Can\'t request API get privacy token list');
      } else if (response.data.Error) {
        throw new CustomError(ErrorObject.GetListPrivacyTokenErr, response.data.Error.Message);
      }

      let pTokens = response.data.Result.ListCustomToken;
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

    getUnspentCustomToken = async (paymentAddrSerialize: any, tokenIDStr: any) => {
      const data = {
        'jsonrpc': '1.0',
        'method': 'listunspentcustomtoken',
        'params': [paymentAddrSerialize, tokenIDStr],
        'id': 1
      };

      let response;
      response = await this.rpcHttpService.postRequest(data);

      //todo:
      // if (response.status !== 200) {
      //   throw new Error("Can't request API get list of unspent custom tokens");
      // } else if (response.data.Error) {
      //   throw response.data.Error;
      // }

      if (response.data.Result) {
        return {
          listUnspentCustomToken: response.data.Result,
        };
      }

      // return {
      //   listUnspentCustomToken: response.data.Result,
      // }
    };

    getEstimateFeePerKB = async (paymentAddrSerialize: any, tokenIDStr: any = null) => {
      const data = {
        'jsonrpc': '1.0',
        'method': 'estimatefeewithestimator',
        'params': [-1, paymentAddrSerialize, 8, tokenIDStr],
        'id': 1
      };

      let response = await this.rpcHttpService.postRequest(data);

      if (response.status !== 200) {
        throw new Error('Can\'t request API get estimate fee per kilibyte');
      } else if (response.data.Error) {
        throw response.data.Error;
      }

      return {
        unitFee: parseInt(response.data.Result.EstimateFeeCoinPerKb)
      };
    }

    getTransactionByHash = async (txHashStr: any) => {
      const data = {

        'method': 'gettransactionbyhash',
        'params': [
          txHashStr,
        ],
        'id': 1
      };

      let response = await this.rpcHttpService.postRequest(data);

      if (response.status !== 200) {
        throw new Error('Can\'t request API get transaction by hash');
      } else if (response.data.Result === null && response.data.Error) {
        return {
          isInBlock: false,
          isInMempool: false,
          err: response.data.Error
        };
      }

      return {
        isInBlock: response.data.Result.IsInBlock,
        isInMempool: response.data.Result.IsInMempool,
        err: <any>null
      };
    }

    getStakingAmount = async (type: any) => {
      const data = {
        'jsonrpc': '1.0',
        'method': 'getstackingamount',
        'params': [type],
        'id': 1
      };

      let response;
      try {
        response = await this.rpcHttpService.postRequest(data);
      } catch (e) {
        throw new CustomError(ErrorObject.GetStakingAmountErr, 'Can\'t request API get staking amount');
      }

      if (response.status !== 200) {
        throw new CustomError(ErrorObject.GetStakingAmountErr, 'Can\'t request API get staking amount');
      } else if (response.data.Error) {
        throw new CustomError(ErrorObject.GetStakingAmountErr, response.data.Error.Message || 'Can\'t request API get staking amount');
      }

      return {
        res: Number(response.data.Result)
      };
    }

    getActiveShard = async () => {
      const data = {
        'jsonrpc': '1.0',
        'method': 'getactiveshards',
        'params': <any[]>[],
        'id': 1
      };

      let response;
      try {
        response = await this.rpcHttpService.postRequest(data);
      } catch (e) {
        throw new CustomError(ErrorObject.GetActiveShardErr, 'Can\'t request API get active shard nunber');
      }

      if (response.status !== 200) {
        throw new CustomError(ErrorObject.GetActiveShardErr, 'Can\'t request API get active shard nunber');
      } else if (response.data.Error) {
        throw new CustomError(ErrorObject.GetActiveShardErr, response.data.Error.Message || 'Can\'t request API get active shard nunber');
      }

      return {
        shardNumber: parseInt(response.data.Result)
      };
    }

    getMaxShardNumber = async () => {
      const data = {
        'jsonrpc': '1.0',
        'method': 'getmaxshardsnumber',
        'params': <any[]>[],
        'id': 1
      };

      let response;
      try {
        response = await this.rpcHttpService.postRequest(data);
      } catch (e) {
        throw new CustomError(ErrorObject.GetMaxShardNumberErr, 'Can\'t request API get max shard number');
      }

      if (response.status !== 200) {
        throw new CustomError(ErrorObject.GetMaxShardNumberErr, 'Can\'t request API get max shard number');
      } else if (response.data.Error) {
        throw new CustomError(ErrorObject.GetMaxShardNumberErr, response.data.Error.Message);
      }

      return {
        shardNumber: parseInt(response.data.Result)
      };
    }

    hashToIdenticon = async (hashStrs: any) => {
      const data = {
        'jsonrpc': '1.0',
        'method': 'hashtoidenticon',
        'params': hashStrs,
        'id': 1
      };

      let response;
      try {
        response = await this.rpcHttpService.postRequest(data);
      } catch (e) {
        throw new CustomError(ErrorObject.HashToIdenticonErr, 'Can\'t request API get image from hash string');
      }

      if (response.status !== 200) {
        throw new CustomError(ErrorObject.HashToIdenticonErr, 'Can\'t request API get image from hash string');
      } else if (response.data.Error) {
        throw new CustomError(ErrorObject.HashToIdenticonErr, response.data.Error.Message);
      }

      return {
        images: response.data.Result
      };
    }

    getRewardAmount = async (paymentAddrStr: any) => {
      const data = {
        'jsonrpc': '1.0',
        'method': 'getrewardamount',
        'params': [paymentAddrStr],
        'id': 1
      };

      let response = await this.rpcHttpService.postRequest(data);

      if (response.status !== 200) {
        throw new Error('Can\'t request API get image from hash string');
      } else if (response.data.Error) {
        throw response.data.Error;
      }

      return {
        rewards: response.data.Result
      };
    }

      getBeaconBestState = async () => {
        const data = {
          'jsonrpc': '1.0',
          'method': 'getbeaconbeststate',
          'params': <any[]>[],
          'id': 1
        };

        let response = await this.rpcHttpService.postRequest(data);

        if (response.status !== 200) {
          throw new Error('Can\'t request API get beacon best state');
        } else if (response.data.Error) {
          throw response.data.Error;
        }

        return {
          bestState: response.data.Result
        };
      };

      getPublicKeyRole = async (publicKey: any) => {
        const data = {
          'jsonrpc': '1.0',
          'method': 'getpublickeyrole',
          'params': [publicKey],
          'id': 1
        };

        let response = await this.rpcHttpService.postRequest(data);
        if (response.status !== 200) {
          throw new Error('Can\'t request API get public key role');
        } else if (response.data.Error) {
          throw response.data.Error;
        }

        return {
          status: response.data.Result
        };
      }

      getPDEState = async (beaconHeight: any) => {
        const data = {
          'jsonrpc': '1.0',
          'method': 'getpdestate',
          'params': [{
            'BeaconHeight': beaconHeight
          }],
          'id': 1
        };

        let response = await this.rpcHttpService.postRequest(data);

        if (response.status !== 200) {
          throw new Error('Can\'t request API get PDE state');
        } else if (response.data.Error) {
          throw response.data.Error;
        }

        return {
          state: response.data.Result
        };
      }

      getPDETradeStatus = async (txId: any) => {
        const data = {
          'id': 1,
          'jsonrpc': '1.0',
          'method': 'getpdetradestatus',
          'params': [
            {
              'TxRequestIDStr': txId
            }
          ]
        };

        let response = await this.rpcHttpService.postRequest(data);

        if (response.status !== 200) {
          throw new Error('Can\'t request API get PDE state');
        } else if (response.data.Error) {
          throw response.data.Error;
        }

        return {
          state: response.data.Result
        };
      }

      getPDEContributionStatus = async (pairId: any) => {
        const data = {
          'id': 1,
          'jsonrpc': '1.0',
          'method': 'getpdecontributionstatus',
          'params': [
            {
              'ContributionPairID': pairId
            }
          ]
        };

        let response = await this.rpcHttpService.postRequest(data);

        if (response.status !== 200) {
          throw new Error('Can\'t request API getPDEContributionStatus');
        } else if (response.data.Error) {
          throw response.data.Error;
        }

        return {
          state: response.data.Result
        };
      }

      getPDEContributionStatusV2 = async (pairId: any) => {
        const data = {
          'id': 1,
          'jsonrpc': '1.0',
          'method': 'getpdecontributionstatusv2',
          'params': [
            {
              'ContributionPairID': pairId
            }
          ]
        };

        let response = await this.rpcHttpService.postRequest(data);

        if (response.status !== 200) {
          throw new Error('Can\'t request API getPDEContributionStatus');
        } else if (response.data.Error) {
          throw response.data.Error;
        }

        return {
          state: response.data.Result
        };
      }

      getPDEWithdrawalStatus = async (txId: any) => {
        const data = {
          'id': 1,
          'jsonrpc': '1.0',
          'method': 'getpdewithdrawalstatus',
          'params': [
            {
              'TxRequestIDStr': txId
            }
          ]
        };

        let response = await this.rpcHttpService.postRequest(data);

        if (response.status !== 200) {
          throw new Error('Can\'t request API getPDEWithdrawalStatus');
        } else if (response.data.Error) {
          throw response.data.Error;
        }

        return {
          state: response.data.Result
        };
      }

      getBlockChainInfo = async () => {
        return parseResponse(this.rpcHttpService, 'getblockchaininfo');
      };

      listRewardAmount = async () => {
        return parseResponse(this.rpcHttpService, 'listrewardamount');
      };

      getBeaconBestStateDetail = async () => {
        return parseResponse(this.rpcHttpService, 'getbeaconbeststatedetail');
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

      console.log('pdeStateRes: ', pdeStateRes);

      let tokenIDArray = [tokenIDStr1, tokenIDStr2];
      tokenIDArray.sort();

      let keyValue = PDEPOOLKEY + '-' + beaconHeight + '-'
            + tokenIDArray[0] + '-' + tokenIDArray[1];

      console.log('pdeStateRes.state.PDEPoolPairs[keyValue]: ', pdeStateRes.state.PDEPoolPairs[keyValue]);

      if (pdeStateRes.state.PDEPoolPairs[keyValue] !== null && pdeStateRes.state.PDEPoolPairs[keyValue] !== undefined) {
        if (tokenIDArray[0] == PRVIDSTR && pdeStateRes.state.PDEPoolPairs[keyValue].Token1PoolValue < 10000 * 1e9) {
          return false;
        }

        if (tokenIDArray[1] == PRVIDSTR && pdeStateRes.state.PDEPoolPairs[keyValue].Token2PoolValue < 10000 * 1e9) {
          return false;
        }

        return true;
      }
      return false;
    }

    getTransactionByReceiver = async (paymentAdrr: any, viewingKey: any) => {
      let data = {
        'jsonrpc': '1.0',
        'method': 'gettransactionbyreceiver',
        'params': [{
          'PaymentAddress': paymentAdrr,
          'ReadonlyKey': viewingKey,
        }
        ],
        'id': 1
      };

      let response = await this.rpcHttpService.postRequest(data);

      if (response.status !== 200) {
        throw new Error('Can\'t request API get all output coins');
      } else if (response.data.Error) {
        throw response.data.Error;
      }

      let result = response.data.Result;
      return {
        receivedTransactions: result.ReceivedTransactions,
      };
    };

    getListPrivacyCustomTokenBalance = async (privateKey: any) => {
      const data = {
        'jsonrpc': '1.0',
        'method': 'getlistprivacycustomtokenbalance',
        'params': [privateKey],
        'id': 1
      };

      let response = await this.rpcHttpService.postRequest(data);

      if (response.status !== 200) {
        throw new Error('Can\'t request API get list privacy custom token balance');
      } else if (response.data.Error) {
        throw response.data.Error;
      }

      return response.data.Result && response.data.Result.ListCustomTokenBalance || [];
    }

    getBurningAddress = async (beaconHeight: number = 0) => {
      const data = {
          "jsonrpc": "1.0",
          "method": "getburningaddress",
          "params": [beaconHeight],
          "id": 1
      };

      let response;
      try {
          response = await this.rpcHttpService.postRequest(data);
      } catch (e) {
          throw e;
      }

      if (response.status !== 200) {
          throw new Error("Can't request API get burning address");
      } else if (response.data.Error) {
          throw response.data.Error;
      }

      return response.data.Result;
    }
}

export default new RpcClient();

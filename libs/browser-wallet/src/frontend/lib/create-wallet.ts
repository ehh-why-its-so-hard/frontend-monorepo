import type { SendMessage } from '@/contexts/json-rpc/json-rpc-provider';

import { RpcMethods } from './client-rpc-methods';

export const WALLET_NAME = 'Wallet 1';

export const importWallet = async (
  mnemonic: string,
  request: SendMessage,
  propagateError: boolean
) => {
  await request(
    RpcMethods.ImportWallet,
    { recoveryPhrase: mnemonic, name: WALLET_NAME },
    propagateError
  );
  await request(
    RpcMethods.GenerateKey,
    {
      wallet: WALLET_NAME,
    },
    propagateError
  );
  await request(
    RpcMethods.GenerateKey,
    {
      wallet: WALLET_NAME,
    },
    propagateError
  );
};

export const createWallet = async (mnemonic: string, request: SendMessage) => {
  await request(RpcMethods.ImportWallet, {
    recoveryPhrase: mnemonic,
    name: WALLET_NAME,
  });
  await request(RpcMethods.GenerateKey, {
    wallet: WALLET_NAME,
  });
};

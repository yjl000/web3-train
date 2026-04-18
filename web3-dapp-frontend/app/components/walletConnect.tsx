'use client';
import { useWallet } from '../context/WalletContext';
import { Button } from 'antd';
import { LOCAL_CHAIN_ID } from "../contract/MyTokenABI";
const anvilChainId = LOCAL_CHAIN_ID; 

export default function WalletConnect() {
  const { isConnected, address, chainId, connectWallet, disconnectWallet, switchChain } = useWallet();

  return (
    <div className="flex items-center gap-3">
      <div>
        <Button disabled={!!(isConnected || !address || (chainId && chainId === anvilChainId))} color="pink" variant="outlined" onClick={() => switchChain(anvilChainId) }>
          Switch Anvil
        </Button>
      </div>
      {!isConnected ? (
        <Button color="pink" variant="outlined" onClick={connectWallet}>
          连接钱包
        </Button>
      ) : (
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-700">
            {address?.slice(0, 6)}...{address?.slice(-4)}
          </span>
          <Button size="small" danger onClick={disconnectWallet}>
            断开
          </Button>
        </div>
      )}
    </div>
  );
}
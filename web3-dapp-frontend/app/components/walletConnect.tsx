'use client';
import { useWallet } from '../context/WalletContext';
import { Button } from 'antd';

export default function WalletConnect() {
  const { isConnected, address, connectWallet, disconnectWallet } = useWallet();

  return (
    <div className="flex items-center gap-3">
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
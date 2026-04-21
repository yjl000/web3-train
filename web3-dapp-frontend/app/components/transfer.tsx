'use client'
import { Input, Button, message } from "antd";
import { useState } from "react";
import { formatUnits } from 'ethers';
import { MY_TOKEN_ADDRESS, LOCAL_CHAIN_ID } from "../contract/MyTokenABI";
import { useWallet } from '../context/WalletContext';


export default function Transfer() {
  const { isConnected, chainId, tokenSymbol, tokenName, tokenDecimals, tokenSupply, balance, address, tokenBalance, transfer } = useWallet();
  const userBalance = balance ? formatUnits(balance, tokenDecimals || 18) : '0';
  const [position, setPosition] = useState<'start' | 'end'>('end');
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState('');
  const [toAddress, setToAddress] = useState('');

  const tokenTransfer = () => {
    if (!amount) {
      message.error('Please input valid amount');
      return
    }
    if (!toAddress) {
      message.error('Please input valid to address');
      return
    }
    if (Number(amount) > Number(userBalance)) {
      message.error('Insufficient token balance');
      return
    }
    setLoading(true);
    transfer(toAddress, amount.toString()).then(() => {
      message.success('Transfer successful');
    }).catch((err) => {
      console.error(err);
      message.error('Transfer failed');
    }).finally(() => {
      setLoading(false);
    });

  }
  return (
    <div className="flex items-center justify-center rounded-lg min-w-lg min-h-full bg-cyan-500 shadow-lg shadow-cyan-500/50">
      <div className="w-full max-w-md p-6">
        <div>
          <span>to address</span>
          <Input placeholder="input to address" value={toAddress} onChange={(e) => setToAddress(e.target.value)} size="large" className="mb-4" />
        </div>
        <div>
          <span>amount</span>
          <Input placeholder="input amount" value={amount} onChange={(e) => setAmount(e.target.value)} size="large" className="mb-4" />
        </div>
        <div className="mt-4">
          <Button onClick={tokenTransfer} type="primary" disabled={!isConnected || chainId !== LOCAL_CHAIN_ID} loading={loading} iconPlacement={position}>
            {loading ? 'Loading' : 'Transfer'}
          </Button>
        </div>
      </div>
    </div>
  );
}
'use client';
import { useState, useEffect } from 'react';
import { Input, message } from 'antd';
import { formatUnits } from 'ethers';
import TokenDataPanel from '../components/tokenDataPanel';
import Transfer from '../components/transfer';
import { useWallet } from '../context/WalletContext';

const { Search } = Input;
export default function Page() {
  const { isConnected, chainId, tokenSymbol, tokenName, tokenDecimals, tokenSupply, balance, address, tokenBalance, getBalance } = useWallet();
  const [loading, setLoading] = useState(false);
  const [searchAddress, setSearchAddress] = useState('');
  // const [currentAddressBalance, setCurrentAddressBalance] = useState(0);

  const onSearch = async (value: string) => {
    console.log(value);
    if (!value) {
      message.error('Please input search address');
      return
    }
    setLoading(true); 
    setSearchAddress(value);
    const result = (await getBalance(value)) as number | undefined;
    // setCurrentAddressBalance(result ?? 0);
    setLoading(false);
  }
  return(
  <div className="flex flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
    <div className='grid grid-cols-1 md:grid-cols-2 gap-8 p-8'>
      <div className='flex flex-col items-start justify-center rounded-lg min-w-lg bg-cyan-500 shadow-lg shadow-cyan-500/50'>
        <div className='w-full max-w-md p-6'>
          <Search placeholder="input search address" enterButton="Search" onSearch={onSearch} size="large" loading={loading} />
        </div>
        <div className='flex flex-col w-full max-w-md p-6'>
          <div>search address: {searchAddress || address}</div>
          <div>address balance: { balance && formatUnits(balance, tokenDecimals || 0)}</div>
        </div>
      </div>
      <TokenDataPanel tokenName={tokenName || ''} tokenSymbol={tokenSymbol || ''} tokenDecimals={tokenDecimals || 0} tokenSupply={ tokenSupply || '0' } tokenBalance={tokenBalance || null} />
      <Transfer />
    </div>
  </div>
  )
}
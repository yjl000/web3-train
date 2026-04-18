'use client';
import { useState, useEffect, useRef, use } from 'react';
import { Input, message } from 'antd';
import TokenDataPanel from '../components/tokenDataPanel';
import { useWallet } from '../context/WalletContext';

const { Search } = Input;
export default function Page() {
  const { tokenSymbol, tokenName, tokenDecimals, tokenSupply } = useWallet();
  const [loading, setLoading] = useState(false);
  const onSearch = (value: string) => {
    console.log(value);
    if (!value) {
      message.error('Please input search address');
      return
    }
    setLoading(true); 
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }
  return(
  <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
    <div className='flex flex-col mb-8'>
      <Search placeholder="input search address" enterButton="Search" onSearch={onSearch} size="large" loading={loading} />
    </div>
    <TokenDataPanel tokenName={tokenName || ''} tokenSymbol={tokenSymbol || ''} tokenDecimals={tokenDecimals || 0} tokenSupply={ tokenSupply || '0' } />
  </div>
  )
}
"use client";
import React, { useEffect, useState } from 'react';
import { useWallet } from '../context/WalletContext';
import { Button } from 'antd';
import { LOCAL_CHAIN_ID } from "../contract/MyTokenABI";
const anvilChainId = LOCAL_CHAIN_ID; 

export default function WalletConnect() {
  const { isConnected, address, chainId, connectWallet, disconnectWallet, switchChain } = useWallet();
  // 明确派生状态，避免在表达式中混淆导致不可预期的禁用行为。
  // 解释：如果已经在 Anvil（chainId === anvilChainId）则不需要切换，按钮应禁用。
  // 如果没有 provider（window.ethereum），也禁用。其他情况下允许切换（即按钮可点）。
  const isOnAnvil = chainId === anvilChainId;

  // 为避免 SSR 与客户端首次渲染不一致导致的 hydration mismatch：
  // 我们使用 mounted 标志在 client mount 后再读取 window.ethereum。
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(t);
  }, []);

  const hasProvider = mounted && ((window as Window & { ethereum?: unknown }).ethereum !== undefined);
  const switchDisabled = !hasProvider || isOnAnvil;

  return (
    <div className="flex items-center gap-3">
      <div>
        <Button disabled={switchDisabled} color="pink" variant="outlined" onClick={() => switchChain(anvilChainId)}>
          {isOnAnvil ? `已在 Anvil (${anvilChainId})` : `切换到 Anvil (${anvilChainId})`}
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
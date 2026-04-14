'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { BrowserProvider, getAddress } from 'ethers';

// EIP-1193 标准类型定义（完全对齐官方）
declare global {
  interface RequestArguments {
    method: string;
    params?: unknown[] | Record<string, unknown>;
  }

  interface EthereumProvider {
    request: (args: RequestArguments) => Promise<unknown>;
    // 官方标准事件监听
    on(event: 'chainChanged', listener: (chainId: string) => void): this;
    on(event: 'accountsChanged', listener: (accounts: string[]) => void): this;
    on(event: string, listener: (...args: unknown[]) => void): this;
    // 官方标准移除监听
    removeListener(event: 'chainChanged', listener: (chainId: string) => void): this;
    removeListener(event: 'accountsChanged', listener: (accounts: string[]) => void): this;
    removeListener(event: string, listener: (...args: unknown[]) => void): this;
  }

  interface Window {
    ethereum?: EthereumProvider;
  }
}

type WalletContextType = {
  address: string | null;
  chainId: number | null;
  isConnected: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => Promise<void>;
};

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  // 🔑 完全对齐官方 chainChanged 回调（接收 chainId: string）
  const handleChainChanged = (chainIdHex: string) => {
    console.log('✅ chainChanged 触发，官方参数：', chainIdHex);
    // 按官方要求：十六进制字符串转数字
    const chainIdNum = parseInt(chainIdHex, 16);
    setChainId(chainIdNum);
  };

  // 获取当前链 ID 的辅助函数（官方 eth_chainId）
  const getCurrentChainId = async (): Promise<number> => {
    if (!window.ethereum) throw new Error('No Ethereum provider');
    const provider = new BrowserProvider(window.ethereum);
    const chainIdHex = await provider.send('eth_chainId', []);
    return parseInt(chainIdHex as string, 16);
  }

  // 🔑 完全对齐官方 accountsChanged 回调（接收 accounts: string[]）
  const handleAccountsChanged = (accounts: string[]) => {
    console.log('✅ accountsChanged 触发，官方参数：', accounts);
    if (accounts.length > 0) {
      setAddress(getAddress(accounts[0]));
      setIsConnected(true);
    } else {
      // 账户为空，同步断开
      setAddress(null);
      setChainId(null);
      setIsConnected(false);
    }
  };

  // 初始化：检查已连接状态
  useEffect(() => {
    const init = async () => {
      if (!window.ethereum) return;
      const provider = new BrowserProvider(window.ethereum);
      
      try {
        const accounts = await provider.listAccounts();
        if (accounts.length > 0) {
          const addr = getAddress(accounts[0].address);
          // 初始化时获取当前链 ID（官方 eth_chainId）
          const chainIdHex = await provider.send('eth_chainId', []);
          setAddress(addr);
          setChainId(parseInt(chainIdHex as string, 16));
          setIsConnected(true);
        }
      } catch (err) {
        console.log('未连接钱包', err);
      }
    };
    init();
  }, []);

  // 🔑 注册官方标准事件监听（完全对齐文档）
  useEffect(() => {
    if (!window.ethereum) return;
    const eth = window.ethereum;

    // 注册官方事件  
    // to-do：on事件目前要重新连接钱包才能监听
    eth.on('chainChanged', handleChainChanged);
    eth.on('accountsChanged', handleAccountsChanged);

    // 兜底：窗口聚焦时同步链状态（解决 MetaMask 偶发不触发事件的问题）
    // 焦点检查兜底
    const checkNetworkNow = async () => {
      console.warn('focus 检查 network 触发');
      try {
        const chainIdNum = await getCurrentChainId();
        console.log('focus 检查到最新链 ID：', chainIdNum);
        setChainId(chainIdNum);
      } catch (e) {
        console.warn('focus 检查失败', e);
      }
    };
    window.addEventListener('focus', checkNetworkNow);

    return () => {
      // 移除官方事件监听（完全对齐）
      eth.removeListener('chainChanged', handleChainChanged);
      eth.removeListener('accountsChanged', handleAccountsChanged);
      window.removeEventListener('focus', checkNetworkNow);
    };
  }, []);

  // 连接钱包
  const connectWallet = async () => {
    if (!window.ethereum) return alert('请安装 MetaMask');
    try {
      const provider = new BrowserProvider(window.ethereum);
      await provider.send('eth_requestAccounts', []);
      const accounts = await provider.listAccounts();
      const chainIdHex = await provider.send('eth_chainId', []);

      setAddress(getAddress(accounts[0].address));
      setChainId(parseInt(chainIdHex as string, 16));
      setIsConnected(true);
    } catch (err) {
      console.error('连接失败', err);
    }
  };

  // ✅ 你找到的 EIP-2255 真正断开方法
  const disconnectWallet = async () => {
    try {
      if (window.ethereum) {
        await window.ethereum.request({
          method: 'wallet_revokePermissions',
          params: [{ eth_accounts: {} }],
        });
      }
    } catch (e) {
      console.warn('撤销权限失败', e);
    } finally {
      setAddress(null);
      setChainId(null);
      setIsConnected(false);
      console.log('✅ 已真正断开钱包授权');
    }
  };

  return (
    <WalletContext.Provider
      value={{ address, chainId, isConnected, connectWallet, disconnectWallet }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const ctx = useContext(WalletContext);
  if (!ctx) {
    return {
      address: null,
      chainId: null,
      isConnected: false,
      connectWallet: async () => {},
      disconnectWallet: async () => {},
    };
  }
  return ctx;
}
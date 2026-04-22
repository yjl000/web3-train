'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { BrowserProvider, getAddress, Contract, parseEther } from 'ethers';
import { message } from 'antd';
import { LOCAL_CHAIN_ID, MY_TOKEN_ADDRESS, MY_TOKEN_ABI } from "../contract/MyTokenABI";
const anvilChainId = LOCAL_CHAIN_ID; // 31337 的十六进制表示
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
  balance: string | null;
  tokenSymbol: string | null;
  tokenName: string | null;
  tokenDecimals: number | null;
  tokenSupply: string | null;
  tokenBalance: string | null;
  connectWallet: () => Promise<boolean | undefined>;
  disconnectWallet: () => Promise<void>;
  getBalance: (_address: string) => Promise<void>;
  switchChain: (chainId: number | string) => Promise<void | undefined>;
  transfer: (to: string, amount: string) => Promise<void>;
};

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [balance, setBalance] = useState<string | null>(null);
  const [tokenSymbol, setTokenSymbol] = useState<string | null>(null);
  const [tokenName, setTokenName] = useState<string | null>(null);
  const [tokenDecimals, setTokenDecimals] = useState<number | null>(null);
  const [tokenSupply, setTokenSupply] = useState<string | null>(null);
  const [tokenBalance, setTokenBalance] = useState<string | null>(null);

  // 🔑 完全对齐官方 chainChanged 回调（接收 chainId: string）
  const handleChainChanged = (chainIdHex: string) => {
    console.log('✅ chainChanged 触发，官方参数：', chainIdHex);
    // 按官方要求：十六进制字符串转数字
    const chainIdNum = parseInt(chainIdHex, 16);
    setChainId(chainIdNum);
    window.location.reload(); // 官方建议链变更后刷新页面
  };

  const getTokenInfo = async (contract: Contract) => {
    if (chainId !== LOCAL_CHAIN_ID) {
      message.error('请切换到 Anvil 本地链（Chain ID: 31337）');
      return;
    }
    const supply = await contract.totalSupply();
    console.warn('11111', supply)
    try {
      const name = await contract.name();
      const symbol = await contract.symbol();
      const decimals = await contract.decimals();
      const supply = await contract.totalSupply();
      const balance = MY_TOKEN_ADDRESS ? await contract.balanceOf(MY_TOKEN_ADDRESS) : null;
      console.log('获取到的 token info：', { name, symbol, decimals, supply: supply.toString(), balance: balance?.toString() });
      setTokenName(name);
      setTokenSymbol(symbol);
      setTokenDecimals(decimals);
      setTokenSupply(supply.toString());
      setTokenBalance(balance ? balance.toString() : null);
    } catch (error) {
      console.error('Error fetching token info:', error);
    }
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
    window.location.reload(); // 官方建议账户变更后刷新页面
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

  useEffect(() => {
    const fetchBalance = async () => {
      console.warn('getBalance===', isConnected, address);
      if (isConnected && address) {
        setBalance(await getBalance(address));
      }
    };
    fetchBalance();
  }, [address, isConnected]);

  useEffect(() => {
    if (isConnected && window.ethereum) {
      const provider = new BrowserProvider(window.ethereum);
      const contract = new Contract(MY_TOKEN_ADDRESS, MY_TOKEN_ABI, provider);
      console.log('获取 token info，当前合约实例：', contract);
      getTokenInfo(contract);
    }
  }, [isConnected]);

  // 连接钱包
  const connectWallet = async () => {
    if (!window.ethereum) return message.error('请安装 MetaMask');
    try {
      const provider = new BrowserProvider(window.ethereum);
      await provider.send('eth_requestAccounts', []);
      const singer = await provider.getSigner();
      const contract = new Contract(MY_TOKEN_ADDRESS, MY_TOKEN_ABI, singer);
      const accounts = await provider.listAccounts();
      const chainIdHex = await provider.send('eth_chainId', []);

      setAddress(getAddress(accounts[0].address));
      setChainId(parseInt(chainIdHex as string, 16));
      setIsConnected(true);
      setBalance((await contract.balanceOf(accounts[0].address)).toString());
      setTokenName(await contract.name());
      setTokenSymbol(await contract.symbol());
      setTokenDecimals(await contract.decimals());
      setTokenSupply((await contract.totalSupply()).toString());
      setTokenBalance((await contract.balanceOf(MY_TOKEN_ADDRESS)).toString());
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error('连接失败', err);
      if (err.code === 4001) {
        message.error('您拒绝了钱包授权')
      } else {
        message.error('钱包连接失败，请检查网络后重试');
      }
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

  const switchChain = async (chainId: number | string) => {
    if (!window.ethereum) {
      message.error('请安装 MetaMask');
      return;
    }
    const ethereum = window.ethereum;
    // 保证传给 wallet_switchEthereumChain 的 chainId 是 0x 前缀的十六进制字符串
    const targetChainIdHex = typeof chainId === 'number' ? `0x${chainId.toString(16)}` : String(chainId);
    // 获取当前链（EIP-1193 返回的是 0x 前缀的十六进制字符串）
    const currentChainIdHex = await ethereum.request({ method: 'eth_chainId' }) as string;
    // 仅在当前链和目标链不一致时发起切换
    if (currentChainIdHex !== targetChainIdHex) {
      await ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: targetChainIdHex }]
      });
    }
    await ethereum.request({
      method: "eth_requestAccounts",
      params: []
    });
    const accounts = await ethereum.request({ method: "eth_accounts" });
    console.log(accounts);
  }

  const getBalance = async (_address: string) => {
    if (!window.ethereum || !_address) return;
      const provider = new BrowserProvider(window.ethereum);
    try {
      await provider.send('eth_requestAccounts', []);
      const singer = await provider.getSigner();
      const contract = new Contract(MY_TOKEN_ADDRESS, MY_TOKEN_ABI, singer);
      const balance = _address ? (await contract.balanceOf(_address)).toString() : null;
      // setBalance(balance)
      return balance;
      // const balance = await provider.getBalance(_address)
      // console.log(formatEther(balance))
      // console.warn('获取地址余额22222', _address, balance);
      // setBalance(balance);
    } catch (err) {
      console.error('获取余额失败', err);
    }
  }

  const transfer = async (to: string, amount: string) => {
    if (!window.ethereum) {
      message.error('请安装 MetaMask');
      return;
    }
    const provider = new BrowserProvider(window.ethereum)
    await provider.send('eth_requestAccounts', [])
    const signer = await provider.getSigner()
    const contract = new Contract(MY_TOKEN_ADDRESS, MY_TOKEN_ABI, signer)
    try {
      console.log('发起转账，参数：', { to, amount });
      const transactionResponse = await contract.transfer(to, parseEther(amount))
      console.log('转账交易已发送，等待确认...', transactionResponse);
      await transactionResponse.wait(1)
      console.log('转账交易已确认！');
      setBalance(await getBalance(address || ''));
      getTokenInfo(contract)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.code === 4001) {
        message.error('用户拒绝了签名')
      }
      message.error('转账失败，请检查输入和网络');
      return Promise.reject(error); // 返回reject,让调用的地方进入 catch
    }
  }

  return (
    <WalletContext.Provider
      value={{
        address, 
        chainId,
        isConnected,
        balance,
        tokenSymbol,
        tokenName,
        tokenDecimals,
        tokenSupply,
        tokenBalance,
        connectWallet,
        disconnectWallet,
        getBalance,
        switchChain,
        transfer,
      }}
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
      balance: null,
      tokenSymbol: null,
      tokenName: null,
      tokenDecimals: null,
      tokenSupply: null,
      tokenBalance: null,
      connectWallet: async () => undefined,
      disconnectWallet: async () => {},
      getBalance: async () => {},
      switchChain: async (chainId: number | string) => {},
      transfer: async (to: string, amount: string) => {},
    };
  }
  return ctx;
}
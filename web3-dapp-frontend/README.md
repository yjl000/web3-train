# web3-dapp-frontend

这是本仓库中用于演示与交互 ERC20 合约的前端（Next.js + React + Ethers）。README 包含功能介绍、如何在本地运行、如何替换合约 ABI/地址以及如何部署合约并将其接入前端的步骤。

## 功能介绍

- 使用 Next.js (app router) 构建的前端界面。
- WalletContext（`app/context/WalletContext.tsx`）封装了连接钱包、读取链 ID、监听 accounts/chainChanged、读取代币信息等功能。
- 提供连接/断开钱包、查看地址、读取代币余额、切换到本地 Anvil 链（chainId: 31337）等交互组件，主要组件在 `app/components/` 中：
  - `walletConnect.tsx`：钱包连接、切换链按钮与地址显示。
  - `tokenDataPanel.tsx` / `transfer.tsx`：读取 token 信息与转账示例。
- 合约 ABI 与默认地址在 `app/contract/MyTokenABI.ts` 中定义（便于替换）。

## 如何运行（开发环境）

先决条件：
- Node.js（推荐 18+）和 npm/yarn/pnpm 中任一包管理器。
- 如果需要与本地链交互，推荐安装 Foundry（anvil / forge）或本地的以太坊节点。

示例快速启动：

1. 安装依赖

```bash
cd web3-dapp-frontend
npm install
# 或者：pnpm install / yarn
```

2. 启动本地链（可选，用 Foundry 的 anvil）

```bash
# 在另一个终端运行
anvil
# anvil 会默认监听 http://127.0.0.1:8545
```

3. 本地开发服务器

```bash
npm run dev
# 浏览器打开 http://localhost:3000
```

4、打包
```bash
npm run build
```

5、运行打包产物
```bash
npm run start
```

注意：页面中会尝试读取 `window.ethereum`，如果使用 MetaMask，确保已安装并允许访问当前页面。

## 如何替换合约（前端接入新的合约）

前端合约信息放在 `app/contract/MyTokenABI.ts`：

- `MY_TOKEN_ADDRESS`：合约地址（字符串）。
- `LOCAL_CHAIN_ID`：当前用于本地链的 chainId，文件中以 0x 前缀十六进制常量表示（例如 `0x7A69` 表示 31337）。
- `MY_TOKEN_ABI`：合约 ABI（JSON 数组）。

替换步骤：

1. 部署/获取新合约地址与 ABI（见“如何部署”）。
2. 打开 `app/contract/MyTokenABI.ts`，把 `MY_TOKEN_ADDRESS` 替换为新地址。
3. 如果合约的 ABI 不同，替换 `MY_TOKEN_ABI` 为新合约的 ABI（确保是 JSON 数组）。
4. 如果合约部署在不同链（chainId），更新 `LOCAL_CHAIN_ID` 为对应链 ID 的 0x 十六进制字符串（例如 `0x1`、`0x5`、`0x7a69` 等）。前端代码中会将数值转换为 hex 传给钱包，推荐使用 0x 前缀格式保持一致性。
5. 重启开发服务器或刷新浏览器页面，组件会读取新的 ABI/地址并与合约交互。

示例：

```ts
export const MY_TOKEN_ADDRESS = "0x...";
export const LOCAL_CHAIN_ID = 0x7A69; // 0x7a69 === 31337
export const MY_TOKEN_ABI = [ /* ...ABI... */ ];
```

## 如何部署（合约部署指导）

本仓库包含一个 `ERC20-foundry/` 示例工程（Foundry）。下面给出使用 Foundry (forge/anvil) 的本地部署流程；如果你使用 Hardhat 或 Remix，可以按对应工具的步骤部署并把地址/ABI 更新到前端。

1. 安装 Foundry（如果未安装）：

```bash
curl -L https://foundry.paradigm.xyz | bash
foundryup
```

2. 启动本地链（anvil）

```bash
anvil
```

3. 在 `ERC20-foundry` 目录下编译并部署合约

```bash
cd ERC20-foundry
forge build
# 使用 forge create 部署（示例）：
forge create --rpc-url http://127.0.0.1:8545 --private-key <YOUR_PRIVATE_KEY> src/MyToken.sol:MyToken
```

部署成功后会输出合约地址；同时你也可以使用脚本或 cast（foundry 工具）与合约交互。

4. 把部署得到的合约地址和 ABI 填回前端

- 在 `ERC20-foundry` 下你可以用 `forge inspect src/MyToken.sol:MyToken abi` 获取 ABI。
- 将 ABI 粘贴到 `app/contract/MyTokenABI.ts` 的 `MY_TOKEN_ABI`，并把 `MY_TOKEN_ADDRESS` 设置为部署地址。

5. 运行前端并连接钱包

- 启动前端（参见“如何运行”）。
- 在 MetaMask 中配置本地网络（Chain ID：31337，RPC URL：http://127.0.0.1:8545），并导入 anvil 的私钥用于测试。

示例：使用 cast 给合约 mint（foundry 自带 cast）：

```bash
cast send <CONTRACT_ADDRESS> "mint(address,uint256)" <TO_ADDRESS> 1000000000000000000000 --private-key <PRIVATE_KEY> --rpc-url http://127.0.0.1:8545
```

## 常见问题与注意事项

- hydration mismatch（服务器渲染与客户端首次渲染不一致）：本项目的一些组件使用 `useEffect`/`mounted` 方式来避免在 SSR 时直接访问 `window` 导致的警告。如果你修改组件，请遵循同样的做法避免在首次渲染中读取浏览器-only 值。
- chainId 格式：与钱包 RPC 交互时，`wallet_switchEthereumChain` 要求传入 0x 前缀的十六进制字符串（例如 `0x7a69`）。前端代码已对数值做转换，但在手动修改 `MyTokenABI.ts` 时请注意格式一致性。

## 目录结构（简要）

- `app/`：Next.js 应用代码（components、context、contract）。
- `app/context/WalletContext.tsx`：钱包与链状态管理。
- `app/components/`：UI 组件（钱包连接、token 面板、转账等）。
- `app/contract/MyTokenABI.ts`：ABI + 地址 + 本地 chainId 常量，便于替换。
- `ERC20-foundry/`：Foundry 示例合约与部署脚本。

---
以上就是本仓库前端部分的功能介绍、运行指南和部署指导。如果你有任何问题或建议，欢迎提出！

'use client'
import { formatUnits } from 'ethers';
export default function TokenDataPanel(
  {tokenName, tokenSymbol, tokenDecimals, tokenSupply, tokenBalance}: {tokenName: string, tokenSymbol: string, tokenDecimals: number, tokenSupply: number | string, tokenBalance: string | null}
) {
  return (
    <div className="flex items-center justify-center rounded-lg min-w-lg bg-cyan-500 shadow-lg shadow-cyan-500/50">
      <div className="w-full max-w-md p-6">
        <h2 className="text-2xl font-bold mb-4">Token Data Panel</h2>
        <div className="flex flex-col">
          <span className="mb-2">Token name: {tokenName}</span>
          <span className="mb-2">Token symbol: {tokenSymbol}</span>
          <span className="mb-2">Token decimals: {tokenDecimals}</span>
          <span className="mb-2">Supply number: {tokenSupply}</span>
          <span className="mb-2">Token balance: { tokenBalance ? formatUnits(tokenBalance, tokenDecimals) : '0' }</span>
        </div>
      </div>
    </div>
  );
}
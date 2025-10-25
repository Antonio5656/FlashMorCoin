import { useState } from 'react';
import { useContractWrite, usePrepareContractWrite } from 'wagmi';
import { parseEther, formatEther } from 'ethers/lib/utils';
import { CONTRACT_ADDRESSES, VAULT_ABI } from '../../lib/web3config';

export default function PositionManager({ address, position, fmcPrice }) {
  const [depositAmount, setDepositAmount] = useState('');
  const [mintAmount, setMintAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [repayAmount, setRepayAmount] = useState('');

  // Contract writes
  const { config: depositConfig } = usePrepareContractWrite({
    address: CONTRACT_ADDRESSES.VAULT,
    abi: VAULT_ABI,
    functionName: 'depositCollateral',
    args: [parseEther(depositAmount || '0')],
  });
  const { write: deposit } = useContractWrite(depositConfig);

  const { config: mintConfig } = usePrepareContractWrite({
    address: CONTRACT_ADDRESSES.VAULT,
    abi: VAULT_ABI,
    functionName: 'mintFMC',
    args: [parseEther(mintAmount || '0')],
  });
  const { write: mint } = useContractWrite(mintConfig);

  const maxMint = position ? (position.collateral * 0.6) - position.debt : 0;

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-500">Colateral Total</div>
          <div className="text-xl font-semibold">
            {position ? formatEther(position.collateral) : '0'} LP
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-500">Deuda FMC</div>
          <div className="text-xl font-semibold">
            {position ? formatEther(position.debt) : '0'} FMC
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-500">Health Factor</div>
          <div className="text-xl font-semibold text-green-600">
            {position?.healthFactor || '∞'}
          </div>
        </div>
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Deposit & Mint */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Depositar y Mintear</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Depositar Colateral (LP Tokens)
              </label>
              <input
                type="number"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                className="w-full p-2 border rounded-md"
                placeholder="0.0"
              />
            </div>
            
            <button
              onClick={() => deposit?.()}
              disabled={!depositAmount}
              className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50"
            >
              Depositar Colateral
            </button>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mintear FMC (Máx: {maxMint.toFixed(2)})
              </label>
              <input
                type="number"
                value={mintAmount}
                onChange={(e) => setMintAmount(e.target.value)}
                className="w-full p-2 border rounded-md"
                placeholder="0.0"
                max={maxMint}
              />
            </div>
            
            <button
              onClick={() => mint?.()}
              disabled={!mintAmount || parseFloat(mintAmount) > maxMint}
              className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              Mintear FMC
            </button>
          </div>
        </div>

        {/* Withdraw & Repay */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Retirar y Pagar</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pagar Deuda FMC
              </label>
              <input
                type="number"
                value={repayAmount}
                onChange={(e) => setRepayAmount(e.target.value)}
                className="w-full p-2 border rounded-md"
                placeholder="0.0"
              />
            </div>
            
            <button
              onClick={() => repay?.()}
              disabled={!repayAmount}
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              Pagar Deuda
            </button>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Retirar Colateral
              </label>
              <input
                type="number"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                className="w-full p-2 border rounded-md"
                placeholder="0.0"
              />
            </div>
            
            <button
              onClick={() => withdraw?.()}
              disabled={!withdrawAmount}
              className="w-full bg-orange-600 text-white py-2 rounded-md hover:bg-orange-700 disabled:opacity-50"
            >
              Retirar Colateral
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
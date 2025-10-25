import { useState } from 'react';
import { useAccount, useContractWrite, usePrepareContractWrite } from 'wagmi';
import { parseEther, formatEther } from 'ethers/lib/utils';

export default function PositionManager({ address, position, fmcPrice }) {
  const [activeAction, setActiveAction] = useState('deposit');
  const [amount, setAmount] = useState('');

  const maxMint = position ? (parseFloat(formatEther(position.collateral)) * 1.5 * 0.6) - parseFloat(formatEther(position.debt)) : 0;
  const maxWithdraw = position ? parseFloat(formatEther(position.collateral)) * 0.8 : 0;

  const actions = [
    { id: 'deposit', name: 'Depositar', color: 'bg-blue-600' },
    { id: 'mint', name: 'Mintear', color: 'bg-green-600' },
    { id: 'repay', name: 'Pagar', color: 'bg-purple-600' },
    { id: 'withdraw', name: 'Retirar', color: 'bg-orange-600' },
  ];

  const handleAction = () => {
    // Simular acción - en producción esto llamaría a los contratos
    alert(`${actions.find(a => a.id === activeAction)?.name} ${amount} tokens`);
    setAmount('');
  };

  const getMaxAmount = () => {
    switch (activeAction) {
      case 'mint': return maxMint;
      case 'withdraw': return maxWithdraw;
      case 'repay': return position ? parseFloat(formatEther(position.debt)) : 0;
      default: return null;
    }
  };

  const getButtonText = () => {
    const action = actions.find(a => a.id === activeAction);
    return `${action?.name} ${action?.id === 'mint' ? 'FMC' : 'Colateral'}`;
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="border-b">
        <div className="flex">
          {actions.map((action) => (
            <button
              key={action.id}
              onClick={() => {
                setActiveAction(action.id);
                setAmount('');
              }}
              className={`flex-1 py-4 px-6 text-center font-medium ${
                activeAction === action.id
                  ? 'border-b-2 border-indigo-600 text-indigo-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {action.name}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6">
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cantidad {activeAction === 'mint' ? 'FMC a mintear' : 'colateral a ' + activeAction}
          </label>
          <div className="flex space-x-4">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="0.0"
              step="0.1"
            />
            {getMaxAmount() !== null && (
              <button
                onClick={() => setAmount(getMaxAmount().toFixed(2))}
                className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium"
              >
                MAX
              </button>
            )}
          </div>
          {getMaxAmount() !== null && (
            <div className="text-sm text-gray-500 mt-2">
              Máximo: {getMaxAmount().toFixed(2)} {activeAction === 'mint' ? 'FMC' : 'LP'}
            </div>
          )}
        </div>

        {activeAction === 'mint' && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <h4 className="font-medium text-blue-800 mb-2">💡 Información de Mint</h4>
            <p className="text-blue-700 text-sm">
              Puedes mintear hasta el 60% del valor de tu colateral. El Health Factor debe mantenerse por encima de 1.5.
            </p>
          </div>
        )}

        {activeAction === 'withdraw' && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
            <h4 className="font-medium text-orange-800 mb-2">⚠️ Advertencia</h4>
            <p className="text-orange-700 text-sm">
              Retirar colateral reduce tu Health Factor. Asegúrate de mantenerlo por encima de 1.5 para evitar liquidación.
            </p>
          </div>
        )}

        <button
          onClick={handleAction}
          disabled={!amount || parseFloat(amount) <= 0}
          className={`w-full py-3 px-4 rounded-lg font-semibold text-white ${
            actions.find(a => a.id === activeAction)?.color
          } hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity`}
        >
          {getButtonText()}
        </button>

        {/* Resumen de transacción */}
        {amount && parseFloat(amount) > 0 && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium mb-3">Resumen de la transacción</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Cantidad:</span>
                <span className="font-medium">{amount} {activeAction === 'mint' ? 'FMC' : 'LP'}</span>
              </div>
              <div className="flex justify-between">
                <span>Health Factor nuevo:</span>
                <span className="font-medium">{(healthFactor - 0.1).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Comisión estimada:</span>
                <span className="font-medium">$0.12</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
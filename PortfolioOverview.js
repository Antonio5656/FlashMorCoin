import { formatEther } from 'ethers/lib/utils';

export default function PortfolioOverview({ address, position, healthFactor, fmcPrice }) {
  const collateralValue = position ? parseFloat(formatEther(position.collateral)) * 1.5 : 0; // Simulado
  const debtValue = position ? parseFloat(formatEther(position.debt)) * parseFloat(fmcPrice) : 0;

  const getHealthFactorColor = (hf) => {
    if (hf > 2) return 'text-green-600';
    if (hf > 1.5) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">Resumen de Portfolio</h3>
      
      <div className="space-y-4">
        <div>
          <div className="text-sm text-gray-500">Colateral Total</div>
          <div className="text-xl font-semibold">
            ${collateralValue.toFixed(2)}
          </div>
          <div className="text-sm text-gray-600">
            {position ? parseFloat(formatEther(position.collateral)).toFixed(2) : '0'} LP
          </div>
        </div>
        
        <div>
          <div className="text-sm text-gray-500">Deuda Total</div>
          <div className="text-xl font-semibold">
            ${debtValue.toFixed(2)}
          </div>
          <div className="text-sm text-gray-600">
            {position ? parseFloat(formatEther(position.debt)).toFixed(2) : '0'} FMC
          </div>
        </div>
        
        <div>
          <div className="text-sm text-gray-500">Valor Neto</div>
          <div className="text-xl font-semibold">
            ${(collateralValue - debtValue).toFixed(2)}
          </div>
        </div>
        
        <div>
          <div className="text-sm text-gray-500">Health Factor</div>
          <div className={`text-xl font-semibold ${getHealthFactorColor(healthFactor)}`}>
            {healthFactor.toFixed(2)}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {healthFactor > 2 && '✅ Seguro'}
            {healthFactor > 1.5 && healthFactor <= 2 && '⚠️ Moderado'}
            {healthFactor <= 1.5 && '🔴 Riesgo de liquidación'}
          </div>
        </div>

        <div className="pt-4 border-t">
          <div className="text-sm text-gray-500">Precio FMC</div>
          <div className="text-lg font-semibold">
            ${fmcPrice}
          </div>
        </div>
      </div>
    </div>
  );
}
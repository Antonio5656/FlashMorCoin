export default function RiskMonitor({ healthFactor }) {
  const getRiskLevel = (hf) => {
    if (hf > 2.5) return { level: 'Bajo', color: 'bg-green-500', text: 'text-green-700' };
    if (hf > 1.8) return { level: 'Moderado', color: 'bg-yellow-500', text: 'text-yellow-700' };
    if (hf > 1.5) return { level: 'Alto', color: 'bg-orange-500', text: 'text-orange-700' };
    return { level: 'Crítico', color: 'bg-red-500', text: 'text-red-700' };
  };

  const risk = getRiskLevel(healthFactor);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">Monitor de Riesgo</h3>
      
      <div className="space-y-4">
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Nivel de Riesgo</span>
            <span className={`px-2 py-1 rounded text-xs font-medium ${risk.text} bg-opacity-20`}>
              {risk.level}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full ${risk.color} transition-all duration-300`}
              style={{ width: `${Math.min(100, (healthFactor / 3) * 100)}%` }}
            ></div>
          </div>
        </div>

        <div className="text-sm space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Límite de liquidación:</span>
            <span className="font-medium">1.50</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Tu Health Factor:</span>
            <span className="font-medium">{healthFactor.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Margen de seguridad:</span>
            <span className="font-medium">{(healthFactor - 1.5).toFixed(2)}</span>
          </div>
        </div>

        {healthFactor <= 1.8 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
            <p className="text-yellow-800 text-sm">
              ⚠️ <strong>Alerta:</strong> Tu Health Factor está bajo. Considera pagar deuda o añadir colateral.
            </p>
          </div>
        )}

        {healthFactor <= 1.5 && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3">
            <p className="text-red-800 text-sm">
              🔴 <strong>Peligro:</strong> Tu posición está en riesgo de liquidación.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
import { useState, useEffect } from 'react';
import { useAccount, useContractRead, useContractWrite, usePrepareContractWrite } from 'wagmi';
import { CONTRACT_ADDRESSES, FMC_ABI, P2P_ABI, SUPPORTED_TOKENS } from '../lib/web3config';

export default function P2PExchange() {
  const { address } = useAccount();
  const [activeTab, setActiveTab] = useState('market');
  const [trades, setTrades] = useState([]);
  const [createAmount, setCreateAmount] = useState('');
  const [createPrice, setCreatePrice] = useState('');
  const [selectedToken, setSelectedToken] = useState('USDC');

  // Leer trades activos del contrato
  const { data: activeTrades, refetch: refetchTrades } = useContractRead({
    address: CONTRACT_ADDRESSES.P2P_EXCHANGE,
    abi: P2P_ABI,
    functionName: 'getActiveTrades',
    watch: true,
  });

  // Configuración para crear trade
  const { config: createTradeConfig } = usePrepareContractWrite({
    address: CONTRACT_ADDRESSES.P2P_EXCHANGE,
    abi: P2P_ABI,
    functionName: 'createTrade',
    args: [
      createAmount ? (createAmount * 1e18).toString() : '0',
      createPrice ? (createPrice * 1e18).toString() : '0',
      SUPPORTED_TOKENS[selectedToken]
    ],
  });

  const { write: createTrade } = useContractWrite(createTradeConfig);

  // Efecto para actualizar trades
  useEffect(() => {
    if (activeTrades) {
      setTrades(activeTrades);
    }
  }, [activeTrades]);

  const handleCreateTrade = () => {
    if (!createAmount || !createPrice) {
      alert('Por favor completa todos los campos');
      return;
    }
    createTrade?.();
  };

  return (
    <div className="bg-white rounded-lg shadow-lg border">
      {/* Header con Tabs */}
      <div className="border-b">
        <nav className="flex">
          {['market', 'create', 'my-trades'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-4 px-6 text-center font-medium ${
                activeTab === tab
                  ? 'border-b-2 border-indigo-600 text-indigo-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab === 'market' && '📊 Mercado P2P'}
              {tab === 'create' && '🆕 Crear Oferta'}
              {tab === 'my-trades' && '👤 Mis Trades'}
            </button>
          ))}
        </nav>
      </div>

      <div className="p-6">
        {/* MERCADO P2P */}
        {activeTab === 'market' && (
          <div>
            <h3 className="text-xl font-semibold mb-4">🎯 Ofertas Activas</h3>
            <div className="space-y-4">
              {trades.length > 0 ? (
                trades.map((trade) => (
                  <TradeCard 
                    key={trade.id} 
                    trade={trade} 
                    onTrade={() => refetchTrades()}
                  />
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No hay ofertas activas en este momento</p>
                  <p className="text-sm">Sé el primero en crear una oferta</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* CREAR OFERTA */}
        {activeTab === 'create' && (
          <div className="max-w-md mx-auto space-y-6">
            <h3 className="text-xl font-semibold text-center">🆕 Crear Nueva Oferta</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cantidad FMC a Vender
              </label>
              <input
                type="number"
                value={createAmount}
                onChange={(e) => setCreateAmount(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                placeholder="0.0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Precio por FMC
              </label>
              <input
                type="number"
                value={createPrice}
                onChange={(e) => setCreatePrice(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                placeholder="1.00"
                step="0.01"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Token de Pago
              </label>
              <select
                value={selectedToken}
                onChange={(e) => setSelectedToken(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                <option value="USDC">USDC</option>
                <option value="DAI">DAI</option>
              </select>
            </div>

            {/* Resumen */}
            {createAmount && createPrice && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">📋 Resumen de la Oferta</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Vendes:</span>
                    <span className="font-semibold">{createAmount} FMC</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Precio unitario:</span>
                    <span className="font-semibold">{createPrice} {selectedToken}</span>
                  </div>
                  <div className="flex justify-between border-t pt-1">
                    <span>Total a recibir:</span>
                    <span className="font-semibold text-green-600">
                      {(createAmount * createPrice).toFixed(2)} {selectedToken}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Fee (0.25%):</span>
                    <span>-{(createAmount * createPrice * 0.0025).toFixed(4)} {selectedToken}</span>
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={handleCreateTrade}
              disabled={!createAmount || !createPrice}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50 transition-colors"
            >
              🚀 Crear Oferta P2P
            </button>
          </div>
        )}

        {/* MIS TRADES */}
        {activeTab === 'my-trades' && (
          <div>
            <h3 className="text-xl font-semibold mb-4">👤 Mis Transacciones</h3>
            <div className="space-y-4">
              {/* Aquí irían los trades del usuario */}
              <div className="text-center py-8 text-gray-500">
                <p>No tienes trades activos</p>
                <p className="text-sm">Crea tu primera oferta en el mercado P2P</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Componente para cada trade
function TradeCard({ trade, onTrade }) {
  const { address } = useAccount();

  // Configuración para ejecutar trade
  const { config: executeTradeConfig } = usePrepareContractWrite({
    address: CONTRACT_ADDRESSES.P2P_EXCHANGE,
    abi: P2P_ABI,
    functionName: 'executeTrade',
    args: [trade.id],
  });

  const { write: executeTrade } = useContractWrite({
    ...executeTradeConfig,
    onSuccess: () => {
      onTrade();
    },
  });

  const totalPrice = (trade.amount * trade.price / 1e36).toFixed(2);
  const unitPrice = (trade.price / 1e18).toFixed(4);

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:border-indigo-300 transition-colors">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-600 font-semibold">FMC</span>
            </div>
            <div>
              <h4 className="font-semibold">{trade.amount / 1e18} FMC</h4>
              <p className="text-sm text-gray-500">
                Vendedor: {`${trade.seller.slice(0, 6)}...${trade.seller.slice(-4)}`}
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Precio Unitario:</span>
              <p className="font-semibold">{unitPrice} USDC</p>
            </div>
            <div>
              <span className="text-gray-500">Total:</span>
              <p className="font-semibold text-green-600">{totalPrice} USDC</p>
            </div>
          </div>
        </div>

        {address !== trade.seller && (
          <button
            onClick={() => executeTrade?.()}
            className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors"
          >
            Comprar
          </button>
        )}

        {address === trade.seller && (
          <button
            onClick={() => {/* cancelTrade */}}
            className="bg-red-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors"
          >
            Cancelar
          </button>
        )}
      </div>
    </div>
  );
}
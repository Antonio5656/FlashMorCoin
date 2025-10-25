export default function MarketList({ lpPrices }) {
  const markets = [
    {
      name: "QUICKSWAP_USDC_WETH",
      description: "USDC/WETH LP Token",
      tvl: "$2.5M",
      apy: "12.5%",
      maxLTV: "60%",
      available: "1,245.50 LP"
    },
    {
      name: "QUICKSWAP_MATIC_USDC", 
      description: "MATIC/USDC LP Token",
      tvl: "$1.8M",
      apy: "15.2%",
      maxLTV: "65%",
      available: "892.75 LP"
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b">
        <h3 className="text-lg font-semibold">Mercados Disponibles</h3>
        <p className="text-gray-600 text-sm mt-1">
          Selecciona un mercado para usar tus LP tokens como colateral
        </p>
      </div>

      <div className="divide-y">
        {markets.map((market, index) => (
          <div key={market.name} className="p-6 hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                    <span className="text-indigo-600 font-semibold">LP</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">{market.name}</h4>
                    <p className="text-gray-600 text-sm">{market.description}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-6 text-center">
                <div>
                  <div className="text-sm text-gray-500">TVL</div>
                  <div className="font-semibold">{market.tvl}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">APY</div>
                  <div className="font-semibold text-green-600">{market.apy}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Max LTV</div>
                  <div className="font-semibold">{market.maxLTV}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Disponible</div>
                  <div className="font-semibold">{market.available}</div>
                </div>
              </div>

              <div className="ml-6">
                <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition-colors">
                  Usar como Colateral
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
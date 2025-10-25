import { useState } from 'react';

export default function WalletInstaller() {
  const [showModal, setShowModal] = useState(false);

  const wallets = [
    {
      name: 'MetaMask',
      icon: '🦊',
      description: 'La wallet más popular para Ethereum y Polygon',
      installUrl: 'https://metamask.io/download/',
      tutorial: 'https://metamask.io/learn/'
    },
    {
      name: 'Trust Wallet',
      icon: '🔷',
      description: 'Wallet móvil con soporte multi-chain',
      installUrl: 'https://trustwallet.com/download/',
      tutorial: 'https://community.trustwallet.com/'
    },
    {
      name: 'Coinbase Wallet',
      icon: '📱',
      description: 'Wallet de Coinbase para Web3',
      installUrl: 'https://www.coinbase.com/wallet/downloads',
      tutorial: 'https://www.coinbase.com/learn'
    },
    {
      name: 'WalletConnect',
      icon: '🔗',
      description: 'Conecta cualquier wallet compatible',
      installUrl: 'https://walletconnect.com/',
      tutorial: 'https://docs.walletconnect.com/'
    }
  ];

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-sm"
      >
        📲 Instalar Wallet
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">
                  📲 Instalar Wallet
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>
              <p className="text-gray-600 mt-2">
                Elige una wallet para comenzar a usar FlashMorCoin
              </p>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {wallets.map((wallet, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                    <div className="flex items-start space-x-3">
                      <div className="text-2xl">{wallet.icon}</div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{wallet.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">{wallet.description}</p>
                        <div className="flex space-x-2 mt-3">
                          <a
                            href={wallet.installUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
                          >
                            Instalar
                          </a>
                          <a
                            href={wallet.tutorial}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="border border-gray-300 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-50 transition-colors"
                          >
                            Tutorial
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h4 className="font-semibold text-yellow-800 mb-2">💡 Consejos para empezar:</h4>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• Descarga MetaMask para navegador de escritorio</li>
                  <li>• Usa Trust Wallet para dispositivos móviles</li>
                  <li>• Guarda tu frase semilla en un lugar seguro</li>
                  <li>• Nunca compartas tu clave privada</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
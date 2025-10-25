import { useState } from 'react';
import { useAccount, useContractWrite, usePrepareContractWrite } from 'wagmi';
import { CONTRACT_ADDRESSES, FMC_ABI } from '../lib/web3config';

export default function P2PPayments() {
  const { address } = useAccount();
  const [showModal, setShowModal] = useState(false);
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [memo, setMemo] = useState('');
  const [activeTab, setActiveTab] = useState('send');

  // Configuración para transferir FMC
  const { config: transferConfig } = usePrepareContractWrite({
    address: CONTRACT_ADDRESSES.FMC,
    abi: FMC_ABI,
    functionName: 'transfer',
    args: [recipient, amount ? (amount * 1e18).toString() : '0'],
  });

  const { write: transfer } = useContractWrite(transferConfig);

  const handleSendPayment = () => {
    if (!recipient || !amount) {
      alert('Por favor completa todos los campos');
      return;
    }
    
    if (transfer) {
      transfer();
      setShowModal(false);
      // Reset form
      setRecipient('');
      setAmount('');
      setMemo('');
    }
  };

  const recentContacts = [
    { address: '0x742d35Cc6634C0532925a3b8D6B6fB6F7A55Bd99', name: 'Carlos M.' },
    { address: '0x8ba1f109551bD432803012645Ac136ddd64DBA72', name: 'Ana R.' },
    { address: '0x5B38Da6a701c568545dCfcB03FcB875f56beddC4', name: 'Miguel T.' }
  ];

  const transactionHistory = [
    { type: 'sent', to: 'Carlos M.', amount: '50.00', date: '2024-01-15', status: 'completed' },
    { type: 'received', from: 'Ana R.', amount: '25.00', date: '2024-01-14', status: 'completed' },
    { type: 'sent', to: 'Miguel T.', amount: '10.00', date: '2024-01-13', status: 'pending' }
  ];

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors text-sm"
      >
        💸 Pagos P2P
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">
                  💸 Pagos Peer-to-Peer
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>
              
              {/* Tabs */}
              <div className="flex space-x-4 mt-4">
                {['send', 'receive', 'history'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      activeTab === tab
                        ? 'bg-green-100 text-green-700'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {tab === 'send' && 'Enviar'}
                    {tab === 'receive' && 'Recibir'}
                    {tab === 'history' && 'Historial'}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6">
              {/* Send Tab */}
              {activeTab === 'send' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Dirección del destinatario
                    </label>
                    <input
                      type="text"
                      value={recipient}
                      onChange={(e) => setRecipient(e.target.value)}
                      placeholder="0x..."
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cantidad FMC
                    </label>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mensaje (opcional)
                    </label>
                    <input
                      type="text"
                      value={memo}
                      onChange={(e) => setMemo(e.target.value)}
                      placeholder="Para: Cena, Regalo, etc."
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>

                  {/* Recent Contacts */}
                  <div>
                    <h4 className="font-medium text-gray-700 mb-3">Contactos recientes</h4>
                    <div className="grid grid-cols-1 gap-2">
                      {recentContacts.map((contact, index) => (
                        <button
                          key={index}
                          onClick={() => setRecipient(contact.address)}
                          className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                        >
                          <div>
                            <div className="font-medium">{contact.name}</div>
                            <div className="text-sm text-gray-500">{contact.address.slice(0, 8)}...{contact.address.slice(-6)}</div>
                          </div>
                          <span className="text-green-600">→</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={handleSendPayment}
                    disabled={!recipient || !amount}
                    className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Enviar Pago
                  </button>
                </div>
              )}

              {/* Receive Tab */}
              {activeTab === 'receive' && (
                <div className="text-center space-y-6">
                  <div className="bg-gray-100 p-8 rounded-lg">
                    <div className="text-4xl mb-4">📱</div>
                    <h3 className="font-semibold text-lg mb-2">Tu dirección para recibir</h3>
                    <div className="bg-white p-3 rounded border break-all font-mono text-sm">
                      {address || 'Conecta tu wallet para ver tu dirección'}
                    </div>
                    <button
                      onClick={() => navigator.clipboard.writeText(address)}
                      className="mt-3 bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 transition-colors"
                    >
                      Copiar Dirección
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="text-2xl mb-2">📤</div>
                      <h4 className="font-semibold text-blue-800">Compartir</h4>
                      <p className="text-blue-700 text-sm mt-1">Comparte tu dirección para recibir pagos</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="text-2xl mb-2">💎</div>
                      <h4 className="font-semibold text-green-800">FMC</h4>
                      <p className="text-green-700 text-sm mt-1">Acepta pagos en FlashMorCoin</p>
                    </div>
                  </div>
                </div>
              )}

              {/* History Tab */}
              {activeTab === 'history' && (
                <div className="space-y-3">
                  {transactionHistory.map((tx, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          tx.type === 'sent' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                        }`}>
                          {tx.type === 'sent' ? '↑' : '↓'}
                        </div>
                        <div>
                          <div className="font-medium">
                            {tx.type === 'sent' ? `Para: ${tx.to}` : `De: ${tx.from}`}
                          </div>
                          <div className="text-sm text-gray-500">{tx.date}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`font-semibold ${
                          tx.type === 'sent' ? 'text-red-600' : 'text-green-600'
                        }`}>
                          {tx.type === 'sent' ? '-' : '+'}{tx.amount} FMC
                        </div>
                        <div className={`text-xs ${
                          tx.status === 'completed' ? 'text-green-600' : 'text-yellow-600'
                        }`}>
                          {tx.status === 'completed' ? '✅ Completado' : '⏳ Pendiente'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
import { useAccount, useConnect, useDisconnect } from 'wagmi'

export default function WalletConnect() {
  const { address, isConnected } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()

  const shortenAddress = (addr) => {
    if (!addr) return ''
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  if (!isConnected) {
    return (
      <button
        onClick={() => connect({ connector: connectors[0] })}
        className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
      >
        Conectar Wallet
      </button>
    )
  }

  return (
    <div className="flex items-center space-x-4">
      <div className="text-right">
        <div className="text-sm font-medium text-gray-900">
          {shortenAddress(address)}
        </div>
        <div className="text-xs text-gray-500">
          Conectado
        </div>
      </div>
      
      <button
        onClick={() => disconnect()}
        className="text-gray-500 hover:text-gray-700 text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded transition-colors"
      >
        Desconectar
      </button>
    </div>
  )
}
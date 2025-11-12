// 🔧 CONFIGURACIÓN AUTOMÁTICA DE REDES
export const AUTO_NETWORKS = {
  // Redes soportadas en orden de prioridad
  supportedNetworks: [
    {
      id: 137,
      name: 'Polygon Mainnet',
      rpcUrl: 'https://polygon-rpc.com',
      explorer: 'https://polygonscan.com',
      nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 }
    },
    {
      id: 80001,
      name: 'Polygon Mumbai',
      rpcUrl: 'https://rpc-mumbai.maticvigil.com',
      explorer: 'https://mumbai.polygonscan.com',
      nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
      isTestnet: true
    },
    {
      id: 1,
      name: 'Ethereum Mainnet',
      rpcUrl: 'https://mainnet.infura.io/v3/',
      explorer: 'https://etherscan.io',
      nativeCurrency: { name: 'Ethereum', symbol: 'ETH', decimals: 18 }
    },
    {
      id: 56,
      name: 'Binance Smart Chain',
      rpcUrl: 'https://bsc-dataseed.binance.org',
      explorer: 'https://bscscan.com',
      nativeCurrency: { name: 'BNB', symbol: 'BNB', decimals: 18 }
    }
  ],

  // 🔍 DETECTAR RED ACTUAL AUTOMÁTICAMENTE
  async detectCurrentNetwork() {
    if (typeof window.ethereum === 'undefined') {
      throw new Error('No wallet detected');
    }

    try {
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      const network = this.supportedNetworks.find(net => `0x${net.id.toString(16)}` === chainId);
      
      return network || {
        id: parseInt(chainId, 16),
        name: 'Unknown Network',
        isSupported: false
      };
    } catch (error) {
      console.error('Error detecting network:', error);
      throw error;
    }
  },

  // 🔄 CAMBIAR RED AUTOMÁTICAMENTE
  async switchToNetwork(networkId) {
    if (typeof window.ethereum === 'undefined') {
      throw new Error('Please install MetaMask');
    }

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${networkId.toString(16)}` }],
      });
      return true;
    } catch (switchError) {
      // Si la red no está agregada, agregarla automáticamente
      if (switchError.code === 4902) {
        return await this.addNetwork(networkId);
      }
      throw switchError;
    }
  },

  // ➕ AGREGAR RED AUTOMÁTICAMENTE
  async addNetwork(networkId) {
    const network = this.supportedNetworks.find(net => net.id === networkId);
    if (!network) {
      throw new Error('Network not supported');
    }

    try {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [{
          chainId: `0x${networkId.toString(16)}`,
          chainName: network.name,
          rpcUrls: [network.rpcUrl],
          nativeCurrency: network.nativeCurrency,
          blockExplorerUrls: [network.explorer]
        }],
      });
      return true;
    } catch (addError) {
      console.error('Error adding network:', addError);
      throw addError;
    }
  },

  // 🎯 CONFIGURACIÓN RECOMENDADA AUTOMÁTICA
  getRecommendedNetwork() {
    // Prioridad: Testnet -> Polygon -> Ethereum -> BSC
    const testnet = this.supportedNetworks.find(net => net.isTestnet);
    const polygon = this.supportedNetworks.find(net => net.id === 137);
    
    return process.env.NODE_ENV === 'development' ? testnet : polygon;
  }
};

export default AUTO_NETWORKS;
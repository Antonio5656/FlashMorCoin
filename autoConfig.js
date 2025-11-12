import AUTO_NETWORKS from '../config/networks.js';
import walletConnector from '../connectors/walletConnector.js';
import contractLoader from './contractLoader.js';

// ⚙️ SISTEMA DE CONFIGURACIÓN AUTOMÁTICA COMPLETA
class AutoConfigurationSystem {
  constructor() {
    this.initialized = false;
    this.config = {
      autoConnect: true,
      autoNetworkSwitch: true,
      fallbackNetworks: [80001, 137, 1], // Mumbai, Polygon, Ethereum
      retryAttempts: 3
    };
  }

  // 🚀 INICIALIZACIÓN AUTOMÁTICA COMPLETA
  async autoInitialize() {
    try {
      console.log('🚀 Starting automatic configuration...');

      // 1. Detectar y conectar wallet
      const walletResult = await this.autoConnectWallet();
      
      // 2. Configurar red óptima
      const networkResult = await this.autoConfigureNetwork();
      
      // 3. Cargar contratos
      const contractsResult = await this.autoLoadContracts();
      
      this.initialized = true;
      
      return {
        success: true,
        wallet: walletResult,
        network: networkResult,
        contracts: contractsResult,
        message: 'Automatic configuration completed successfully'
      };
      
    } catch (error) {
      console.error('Automatic configuration failed:', error);
      
      return {
        success: false,
        error: error.message,
        message: 'Automatic configuration failed. Please check console for details.'
      };
    }
  }

  // 🔌 CONEXIÓN AUTOMÁTICA DE WALLET
  async autoConnectWallet() {
    console.log('🔌 Auto-connecting to wallet...');
    
    try {
      const result = await walletConnector.autoConnect();
      console.log('✅ Wallet connected:', result.wallet, result.address);
      return result;
      
    } catch (error) {
      console.warn('⚠️ Auto-connect failed, user will need to connect manually');
      throw new Error('Wallet auto-connect failed. Please connect manually.');
    }
  }

  // 🌐 CONFIGURACIÓN AUTOMÁTICA DE RED
  async autoConfigureNetwork() {
    console.log('🌐 Auto-configuring network...');
    
    try {
      // Detectar red actual
      const currentNetwork = await AUTO_NETWORKS.detectCurrentNetwork();
      
      if (currentNetwork.isSupported) {
        console.log('✅ Already on supported network:', currentNetwork.name);
        return currentNetwork;
      }

      // Cambiar a red recomendada
      const recommendedNetwork = AUTO_NETWORKS.getRecommendedNetwork();
      console.log('🔄 Switching to recommended network:', recommendedNetwork.name);
      
      await AUTO_NETWORKS.switchToNetwork(recommendedNetwork.id);
      
      return recommendedNetwork;
      
    } catch (error) {
      console.warn('⚠️ Network auto-configuration failed:', error.message);
      throw new Error('Network configuration failed. Please switch networks manually.');
    }
  }

  // 📦 CARGA AUTOMÁTICA DE CONTRATOS
  async autoLoadContracts() {
    console.log('📦 Auto-loading contracts...');
    
    try {
      const { provider, signer } = walletConnector.getConnectionInfo();
      
      if (!provider) {
        throw new Error('No provider available');
      }

      await contractLoader.initializeWithProvider(provider, signer);
      const status = contractLoader.getContractStatus();
      
      console.log('✅ Contracts loaded:', Object.keys(status));
      return status;
      
    } catch (error) {
      console.error('❌ Contract loading failed:', error);
      throw new Error('Failed to load contracts. Please refresh the page.');
    }
  }

  // 🔄 REINICIALIZACIÓN AUTOMÁTICA (para cambios de red/wallet)
  async reinitializeOnChange() {
    if (!this.initialized) return;

    console.log('🔄 Reinitializing due to network/wallet change...');
    
    try {
      await this.autoLoadContracts();
      console.log('✅ Reinitialization completed');
    } catch (error) {
      console.warn('⚠️ Reinitialization failed:', error.message);
    }
  }

  // 📊 OBTENER ESTADO DEL SISTEMA
  getSystemStatus() {
    const walletInfo = walletConnector.getConnectionInfo();
    const contractStatus = contractLoader.getContractStatus();
    
    return {
      initialized: this.initialized,
      wallet: {
        connected: walletInfo.connected,
        address: walletInfo.address,
        wallet: walletInfo.wallet
      },
      contracts: contractStatus,
      config: this.config
    };
  }

  // ⚙️ CONFIGURAR OPCIONES
  setConfiguration(options) {
    this.config = { ...this.config, ...options };
    console.log('⚙️ Configuration updated:', this.config);
  }
}

// 🎯 INSTANCIA GLOBAL DEL SISTEMA
const autoConfigSystem = new AutoConfigurationSystem();

// 🎧 CONFIGURAR EVENT LISTENERS GLOBALES
window.addEventListener('wallet:accountsChanged', () => {
  autoConfigSystem.reinitializeOnChange();
});

window.addEventListener('wallet:chainChanged', () => {
  autoConfigSystem.reinitializeOnChange();
});

window.addEventListener('wallet:disconnect', () => {
  autoConfigSystem.initialized = false;
});

export default autoConfigSystem;
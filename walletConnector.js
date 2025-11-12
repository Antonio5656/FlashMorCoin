// 🔗 CONECTOR UNIVERSAL DE WALLETS
class UniversalWalletConnector {
  constructor() {
    this.connected = false;
    this.userAddress = null;
    this.provider = null;
    this.walletName = null;
    this.supportedWallets = ['metamask', 'walletconnect', 'coinbase', 'trustwallet'];
  }

  // 🔍 DETECTAR WALLETS DISPONIBLES AUTOMÁTICAMENTE
  async detectAvailableWallets() {
    const availableWallets = [];

    // Detectar MetaMask
    if (typeof window.ethereum !== 'undefined') {
      if (window.ethereum.isMetaMask) {
        availableWallets.push({
          name: 'metamask',
          title: 'MetaMask',
          icon: '🦊',
          priority: 1
        });
      }
      
      // Detectar Coinbase Wallet
      if (window.ethereum.isCoinbaseWallet) {
        availableWallets.push({
          name: 'coinbase',
          title: 'Coinbase Wallet',
          icon: '📱',
          priority: 2
        });
      }

      // Detectar Trust Wallet
      if (window.ethereum.isTrust) {
        availableWallets.push({
          name: 'trustwallet',
          title: 'Trust Wallet',
          icon: '🔒',
          priority: 3
        });
      }

      // Wallet genérica (otras wallets compatibles con EIP-1193)
      if (availableWallets.length === 0) {
        availableWallets.push({
          name: 'generic',
          title: 'Ethereum Wallet',
          icon: '🔗',
          priority: 4
        });
      }
    }

    // WalletConnect siempre disponible
    availableWallets.push({
      name: 'walletconnect',
      title: 'WalletConnect',
      icon: '📡',
      priority: 5
    });

    return availableWallets.sort((a, b) => a.priority - b.priority);
  }

  // 🔌 CONEXIÓN AUTOMÁTICA A LA MEJOR WALLET DISPONIBLE
  async autoConnect() {
    try {
      const availableWallets = await this.detectAvailableWallets();
      
      if (availableWallets.length === 0) {
        throw new Error('No wallets detected. Please install MetaMask or another Web3 wallet.');
      }

      // Intentar conectar con la wallet de mayor prioridad
      const bestWallet = availableWallets[0];
      return await this.connectToWallet(bestWallet.name);
      
    } catch (error) {
      console.error('Auto-connect failed:', error);
      throw error;
    }
  }

  // 🔄 CONECTAR A WALLET ESPECÍFICA
  async connectToWallet(walletName) {
    try {
      let provider;

      switch (walletName) {
        case 'metamask':
        case 'coinbase':
        case 'trustwallet':
        case 'generic':
          provider = window.ethereum;
          break;
          
        case 'walletconnect':
          provider = await this.initWalletConnect();
          break;
          
        default:
          throw new Error(`Wallet ${walletName} not supported`);
      }

      // Solicitar conexión de cuentas
      const accounts = await provider.request({ 
        method: 'eth_requestAccounts' 
      });

      if (accounts.length === 0) {
        throw new Error('No accounts found');
      }

      this.provider = provider;
      this.userAddress = accounts[0];
      this.connected = true;
      this.walletName = walletName;

      // Configurar listeners de eventos
      this.setupEventListeners();

      return {
        success: true,
        address: this.userAddress,
        wallet: walletName,
        provider: this.provider
      };

    } catch (error) {
      console.error(`Connection to ${walletName} failed:`, error);
      throw error;
    }
  }

  // 📡 INICIALIZAR WALLETCONNECT
  async initWalletConnect() {
    // En una implementación real, aquí inicializarías WalletConnect
    // Por ahora simulamos la compatibilidad
    if (typeof window.WalletConnect === 'undefined') {
      throw new Error('WalletConnect not available');
    }
    
    // Simulación - en producción usarías la librería real
    return {
      request: async (method, params) => {
        // Implementación de WalletConnect
        return await this.walletConnectRequest(method, params);
      }
    };
  }

  // 🎧 CONFIGURAR EVENT LISTENERS AUTOMÁTICOS
  setupEventListeners() {
    if (!this.provider || !this.provider.on) return;

    // Escuchar cambios de cuenta
    this.provider.on('accountsChanged', (accounts) => {
      if (accounts.length === 0) {
        this.handleDisconnect();
      } else {
        this.userAddress = accounts[0];
        this.emitEvent('accountsChanged', accounts);
      }
    });

    // Escuchar cambios de red
    this.provider.on('chainChanged', (chainId) => {
      this.emitEvent('chainChanged', chainId);
    });

    // Escuchar desconexión
    this.provider.on('disconnect', (error) => {
      this.handleDisconnect();
    });
  }

  // 📤 MANEJAR DESCONEXIÓN
  handleDisconnect() {
    this.connected = false;
    this.userAddress = null;
    this.walletName = null;
    this.emitEvent('disconnect');
  }

  // 📢 SISTEMA DE EVENTOS
  emitEvent(eventName, data) {
    const event = new CustomEvent(`wallet:${eventName}`, { detail: data });
    window.dispatchEvent(event);
  }

  // 📝 OBTENER INFORMACIÓN DE CONEXIÓN
  getConnectionInfo() {
    return {
      connected: this.connected,
      address: this.userAddress,
      wallet: this.walletName,
      provider: this.provider
    };
  }

  // 🚪 DESCONECTAR
  async disconnect() {
    if (this.walletName === 'walletconnect' && this.provider.disconnect) {
      await this.provider.disconnect();
    }
    
    this.handleDisconnect();
    return { success: true, message: 'Disconnected successfully' };
  }
}

// 🎯 INSTANCIA GLOBAL DEL CONECTOR
const walletConnector = new UniversalWalletConnector();
export default walletConnector;
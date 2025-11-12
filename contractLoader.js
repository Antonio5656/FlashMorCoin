import { ethers } from 'ethers';
import AUTO_NETWORKS from '../config/networks.js';

// 📦 CARGADOR DINÁMICO DE CONTRATOS
class DynamicContractLoader {
  constructor() {
    this.contracts = new Map();
    this.provider = null;
    this.signer = null;
  }

  // 🔧 INICIALIZAR CON PROVIDER AUTOMÁTICAMENTE
  async initializeWithProvider(provider, signer = null) {
    this.provider = provider;
    this.signer = signer;
    
    // Cargar ABI y direcciones automáticamente
    await this.loadContractData();
  }

  // 📥 CARGAR DATOS DE CONTRATOS AUTOMÁTICAMENTE
  async loadContractData() {
    try {
      // Detectar red actual
      const network = await AUTO_NETWORKS.detectCurrentNetwork();
      
      // Cargar direcciones basadas en la red
      const addresses = await this.loadAddressesForNetwork(network.id);
      
      // Cargar ABIs
      const abis = await this.loadABIs();
      
      // Inicializar contratos
      await this.initializeContracts(addresses, abis);
      
      return { success: true, network: network.name };
      
    } catch (error) {
      console.error('Error loading contract data:', error);
      throw error;
    }
  }

  // 🎯 CARGAR DIRECCIONES POR RED AUTOMÁTICAMENTE
  async loadAddressesForNetwork(networkId) {
    // Base de datos de direcciones por red
    const networkAddresses = {
      137: { // Polygon Mainnet
        farmUSD: '0xPolygonMainnetFarmUSDAddress',
        vault: '0xPolygonMainnetVaultAddress',
        minter: '0xPolygonMainnetMinterAddress'
      },
      80001: { // Mumbai Testnet
        farmUSD: '0xMumbaiFarmUSDAddress',
        vault: '0xMumbaiVaultAddress', 
        minter: '0xMumbaiMinterAddress'
      },
      1: { // Ethereum Mainnet
        farmUSD: '0xEthereumFarmUSDAddress',
        vault: '0xEthereumVaultAddress',
        minter: '0xEthereumMinterAddress'
      },
      56: { // BSC Mainnet
        farmUSD: '0xBSCFarmUSDAddress',
        vault: '0xBSCVaultAddress',
        minter: '0xBSCMinterAddress'
      }
    };

    const addresses = networkAddresses[networkId];
    
    if (!addresses) {
      throw new Error(`No contract addresses found for network ${networkId}`);
    }

    return addresses;
  }

  // 📄 CARGAR ABIS DINÁMICAMENTE
  async loadABIs() {
    // En una implementación real, cargarías estos ABIs desde archivos JSON
    // o desde una API. Por ahora los definimos aquí.
    
    return {
      farmUSD: [
        "function name() view returns (string)",
        "function symbol() view returns (string)",
        "function decimals() view returns (uint8)",
        "function totalSupply() view returns (uint256)",
        "function balanceOf(address) view returns (uint256)",
        "function transfer(address to, uint256 amount) returns (bool)",
        "function mint(address to, uint256 amount) external",
        "function burn(address from, uint256 amount) external",
        "event Transfer(address indexed from, address indexed to, uint256 value)"
      ],
      vault: [
        "function deposit(uint256 amount) external",
        "function withdraw(uint256 amount) external", 
        "function positions(address) view returns (uint256 collateral, uint256 debt)",
        "function getCollateralValue(address user) view returns (uint256)",
        "function canLiquidate(address user) view returns (bool)",
        "function LTV() view returns (uint256)",
        "function lpToken() view returns (address)",
        "event Deposited(address indexed user, uint256 amount)",
        "event Withdrawn(address indexed user, uint256 amount)"
      ],
      minter: [
        "function mint(uint256 amount) external",
        "function burn(uint256 amount) external", 
        "function mintFee() view returns (uint256)",
        "function burnFee() view returns (uint256)",
        "event Minted(address indexed user, uint256 amount, uint256 fee)",
        "event Burned(address indexed user, uint256 amount, uint256 fee)"
      ]
    };
  }

  // 🔨 INICIALIZAR CONTRATOS
  async initializeContracts(addresses, abis) {
    for (const [contractName, address] of Object.entries(addresses)) {
      const abi = abis[contractName];
      
      if (!abi) {
        console.warn(`No ABI found for ${contractName}`);
        continue;
      }

      let contract;
      
      if (this.signer) {
        // Usar signer para transacciones
        contract = new ethers.Contract(address, abi, this.signer);
      } else {
        // Usar provider solo para lectura
        contract = new ethers.Contract(address, abi, this.provider);
      }

      this.contracts.set(contractName, contract);
      
      console.log(`✅ Contract ${contractName} loaded at ${address}`);
    }
  }

  // 📡 OBTENER CONTRATO
  getContract(contractName) {
    const contract = this.contracts.get(contractName);
    
    if (!contract) {
      throw new Error(`Contract ${contractName} not loaded`);
    }
    
    return contract;
  }

  // 🔄 ACTUALIZAR SIGNER (cuando cambia la wallet)
  updateSigner(signer) {
    this.signer = signer;
    
    // Re-inicializar contratos con nuevo signer
    for (const [contractName, contract] of this.contracts.entries()) {
      const contractWithSigner = contract.connect(signer);
      this.contracts.set(contractName, contractWithSigner);
    }
  }

  // 📊 OBTENER ESTADO DE CONTRATOS
  getContractStatus() {
    const status = {};
    
    for (const [contractName, contract] of this.contracts.entries()) {
      status[contractName] = {
        address: contract.address,
        connected: !!contract.signer || !!contract.provider,
        network: contract.provider?.network?.name || 'unknown'
      };
    }
    
    return status;
  }
}

// 🎯 INSTANCIA GLOBAL DEL CARGADOR
const contractLoader = new DynamicContractLoader();
export default contractLoader;
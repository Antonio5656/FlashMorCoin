// Agregar al archivo existente
export const P2P_ABI = [
  // ... ABI del contrato P2PExchange
  "function createTrade(uint256 amount, uint256 price, address paymentToken) external",
  "function executeTrade(uint256 tradeId) external",
  "function cancelTrade(uint256 tradeId) external",
  "function getActiveTrades() external view returns (tuple(uint256 id, address seller, address buyer, uint256 amount, uint256 price, address paymentToken, bool isActive, bool isCompleted, uint256 createdAt, uint256 completedAt)[])",
  "function platformFee() external view returns (uint256)",
  "function allowedPaymentTokens(address) external view returns (bool)"
];

export const SUPPORTED_TOKENS = {
  'USDC': '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
  'DAI': '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063'
};

// Agregar al CONTRACT_ADDRESSES
export const CONTRACT_ADDRESSES = {
  // ... contratos existentes
  P2P_EXCHANGE: "0x...", // Actualizar después del deployment
};
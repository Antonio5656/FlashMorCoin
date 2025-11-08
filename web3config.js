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
  'USDC': '0x5774808c2856f7FDF1A0a8F375A41559794BeF6B',
  'DAI': '0x5774808c2856f7FDF1A0a8F375A41559794BeF6B'
};

// Agregar al CONTRACT_ADDRESSES
export const CONTRACT_ADDRESSES = {
  // ... contratos existentes
  P2P_EXCHANGE: "0xfb146E2601c5F77743E4888E75D6577C2F56bAbb", // Actualizar después del deployment
};
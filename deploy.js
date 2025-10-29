// scripts/deploy.js - Usa la configuración de hardhat
async main() {
  // Se conecta via Alchemy automáticamente
  const fmc = await FlashMorCoin.deploy();
}
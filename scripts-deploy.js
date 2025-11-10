// scripts/deploy.js
const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  const feeWallet = deployer.address; // Cambia esto si usas una wallet distinta
  const platformWallet = deployer.address;

  console.log("Desplegando contratos con la cuenta:", deployer.address);

  // 1. Desplegar FlashMorCoin
  const FlashMorCoin = await ethers.getContractFactory("FlashMorCoin");
  const fmc = await FlashMorCoin.deploy();
  await fmc.waitForDeployment();
  console.log("FlashMorCoin desplegado en:", await fmc.getAddress());

  // 2. Acuñar tokens para pruebas (1 millón de FMC)
  const initialSupply = ethers.parseEther("1000000"); // 1M FMC
  await fmc.mint(deployer.address, initialSupply);
  console.log("Acuñados 1M FMC para el deployer");

  // 3. Desplegar el exchange P2P
  const FMCP2PExchange = await ethers.getContractFactory("FMCP2PExchange");
  const exchange = await FMCP2PExchange.deploy(
    await fmc.getAddress(),
    feeWallet
  );
  await exchange.waitForDeployment();
  console.log("FMCP2PExchange desplegado en:", await exchange.getAddress());

  // 4. Desplegar el staking (opcional, pero incluido)
  const FMCStaking = await ethers.getContractFactory("FMCStaking");
  const staking = await FMCStaking.deploy(
    await fmc.getAddress(),
    deployer.address,    // rewardWallet (de donde salen las recompensas)
    platformWallet
  );
  await staking.waitForDeployment();
  console.log("FMCStaking desplegado en:", await staking.getAddress());

  // 5. Aprobar al contrato de staking para gastar del rewardWallet (si es la misma wallet, no es necesario)
  // Pero si usas un multisig, deberás hacer esto manualmente

  console.log("\n✅ ¡Despliegue completado!");
  console.log("FMC Token:", await fmc.getAddress());
  console.log("Exchange:", await exchange.getAddress());
  console.log("Staking :", await staking.getAddress());
  console.log("Fee Wallet:", feeWallet);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
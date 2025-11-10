// scripts/verify.js
const { ethers, run } = require("hardhat");

async function main() {
  // Direcciones desplegadas (reemplaza con las tuyas o pásalas como argumentos)
  const FMC_ADDRESS = "0x..."; // Tu FlashMorCoin
  const EXCHANGE_ADDRESS = "0x..."; // Tu FMCP2PExchange
  const STAKING_ADDRESS = "0x..."; // Tu FMCStaking
  const PRESALE_ADDRESS = "0x..."; // Tu FMCPresale

  const [deployer] = await ethers.getSigners();
  const feeWallet = deployer.address;
  const platformWallet = deployer.address;

  console.log("Verificando contratos en Polygonscan...");

  try {
    // 1. Verificar FlashMorCoin
    await run("verify:verify", {
      address: FMC_ADDRESS,
      constructorArguments: [],
    });
    console.log("✅ FlashMorCoin verificado");

    // 2. Verificar FMCP2PExchange
    await run("verify:verify", {
      address: EXCHANGE_ADDRESS,
      constructorArguments: [
        FMC_ADDRESS,
        feeWallet
      ],
    });
    console.log("✅ FMCP2PExchange verificado");

    // 3. Verificar FMCStaking
    await run("verify:verify", {
      address: STAKING_ADDRESS,
      constructorArguments: [
        FMC_ADDRESS,
        deployer.address, // rewardWallet
        platformWallet
      ],
    });
    console.log("✅ FMCStaking verificado");

    // 4. Verificar FMCPresale
    const USDC_MUMBAI = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174";
    await run("verify:verify", {
      address: PRESALE_ADDRESS,
      constructorArguments: [
        FMC_ADDRESS,
        USDC_MUMBAI,
        deployer.address, // treasuryWallet
        platformWallet
      ],
    });
    console.log("✅ FMCPresale verificado");

  } catch (error) {
    console.error("Error en verificación:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
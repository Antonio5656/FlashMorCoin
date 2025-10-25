const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Iniciando deployment de FlashMorCoin...");

  const [deployer] = await ethers.getSigners();
  console.log(`🔑 Desplegando con la cuenta: ${deployer.address}`);

  // 1. Deploy FlashMorCoin Token
  console.log("📝 Desplegando FlashMorCoin...");
  const FlashMorCoin = await ethers.getContractFactory("FlashMorCoin");
  const fmc = await FlashMorCoin.deploy();
  await fmc.deployed();
  console.log(`✅ FlashMorCoin desplegado en: ${fmc.address}`);

  // 2. Deploy Oracle
  console.log("🔮 Desplegando Oracle...");
  const FMCOracle = await ethers.getContractFactory("FMCOracle");
  const oracle = await FMCOracle.deploy();
  await oracle.deployed();
  console.log(`✅ Oracle desplegado en: ${oracle.address}`);

  // 3. Deploy Vault
  console.log("🏦 Desplegando Vault...");
  const FMCVault = await ethers.getContractFactory("FMCVault");
  const vault = await FMCVault.deploy(fmc.address, oracle.address);
  await vault.deployed();
  console.log(`✅ Vault desplegado en: ${vault.address}`);

  // 4. Configurar permisos
  console.log("⚙️ Configurando permisos...");
  await fmc.transferOwnership(vault.address);
  console.log("✅ Permisos configurados");

  // 5. Guardar addresses
  const deploymentInfo = {
    FlashMorCoin: fmc.address,
    FMCOracle: oracle.address,
    FMCVault: vault.address,
    network: network.name,
    deployer: deployer.address,
    timestamp: new Date().toISOString()
  };

  const fs = require("fs");
  fs.writeFileSync("deployment.json", JSON.stringify(deploymentInfo, null, 2));
  
  console.log("📄 Información de deployment guardada en deployment.json");
  console.log("🎉 ¡Deployment completado exitosamente!");
  console.log("\n📋 Resumen:");
  console.log(`   FlashMorCoin: ${fmc.address}`);
  console.log(`   Oracle: ${oracle.address}`);
  console.log(`   Vault: ${vault.address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error en deployment:", error);
    process.exit(1);
  });
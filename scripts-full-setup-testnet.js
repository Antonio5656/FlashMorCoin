// scripts/full-setup-testnet.js
const { ethers } = require("hardhat");
const fs = require("fs");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("🚀 Iniciando configuración completa en Mumbai...");
  console.log("Wallet:", deployer.address);

  // === 1. Desplegar FMC ===
  console.log("\n1. Desplegando FlashMorCoin...");
  const FlashMorCoin = await ethers.getContractFactory("FlashMorCoin");
  const fmc = await FlashMorCoin.deploy();
  await fmc.waitForDeployment();
  const fmcAddress = await fmc.getAddress();
  console.log("✅ FMC:", fmcAddress);

  // Acuñar 1M FMC
  await fmc.mint(deployer.address, ethers.parseEther("1000000"));
  console.log("✅ 1,000,000 FMC acuñados");

  // === 2. Desplegar USDC Mock ===
  console.log("\n2. Desplegando USDC Mock (6 decimales)...");
  const ERC20Mock = await ethers.getContractFactory("ERC20Mock");
  const usdc = await ERC20Mock.deploy("USDC", "USDC", 6);
  await usdc.waitForDeployment();
  const usdcAddress = await usdc.getAddress();
  console.log("✅ USDC Mock:", usdcAddress);

  // Acuñar 10,000 USDC
  await usdc.mint(deployer.address, ethers.parseUnits("10000", 6));
  console.log("✅ 10,000 USDC acuñados");

  // === 3. Desplegar Exchange ===
  console.log("\n3. Desplegando FMCP2PExchange...");
  const Exchange = await ethers.getContractFactory("FMCP2PExchange");
  const exchange = await Exchange.deploy(fmcAddress, deployer.address);
  await exchange.waitForDeployment();
  const exchangeAddress = await exchange.getAddress();
  console.log("✅ Exchange:", exchangeAddress);

  // === 4. Aprobar tokens y crear trade ===
  console.log("\n4. Creando trade de prueba...");
  
  // Aprobar FMC al exchange
  await fmc.approve(exchangeAddress, ethers.parseEther("100"));
  
  // Crear trade: 100 FMC a 1.5 USDC cada uno → price = 1.5 * 1e6 = 1_500_000
  await exchange.createTrade(
    ethers.parseEther("100"),
    1_500_000,
    usdcAddress
  );
  console.log("✅ Trade #1 creado: 100 FMC @ 1.5 USDC cada uno");

  // === 5. Guardar direcciones para el frontend ===
  const config = {
    network: "mumbai",
    fmcToken: fmcAddress,
    usdcToken: usdcAddress,
    exchange: exchangeAddress,
    owner: deployer.address
  };
  fs.writeFileSync("./frontend-config.json", JSON.stringify(config, null, 2));
  console.log("\n📄 Configuración guardada en: frontend-config.json");

  console.log("\n🎉 ¡TODO LISTO!");
  console.log("➡️  Importa FMC y USDC en MetaMask usando las direcciones en frontend-config.json");
  console.log("➡️  Usa el frontend con estas direcciones");
  console.log("➡️  Ejecuta el trade desde otra wallet o la misma (si el contrato lo permite)");
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
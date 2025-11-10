// scripts/deploy-and-verify.js
const { ethers, run } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Desplegando con:", deployer.address);

  // 1. Desplegar FMC
  const FMC = await ethers.getContractFactory("FlashMorCoin");
  const fmc = await FMC.deploy();
  await fmc.waitForDeployment();
  console.log("FMC:", await fmc.getAddress());

  // Acuñar para pruebas
  await fmc.mint(deployer.address, ethers.parseEther("1000000"));

  // 2. Desplegar Exchange
  const Exchange = await ethers.getContractFactory("FMCP2PExchange");
  const exchange = await Exchange.deploy(await fmc.getAddress(), deployer.address);
  await exchange.waitForDeployment();
  console.log("Exchange:", await exchange.getAddress());

  // 3. Verificar automáticamente
  console.log("Esperando 30s para que el explorador indexe...");
  await new Promise(r => setTimeout(r, 30000));

  await run("verify:verify", { address: await fmc.getAddress() });
  await run("verify:verify", {
    address: await exchange.getAddress(),
    constructorArguments: [await fmc.getAddress(), deployer.address]
  });

  console.log("✅ ¡Despliegue y verificación completados!");
}

main().catch(console.error);
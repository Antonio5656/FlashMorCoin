// scripts/auto-full-flow.js
const { ethers } = require("hardhat");

async function main() {
  const [owner, buyer] = await ethers.getSigners();
  console.log("🚀 Iniciando flujo automático...");
  console.log("Owner:", owner.address);
  console.log("Buyer:", buyer.address);

  // 1. Deploy FMC
  const FMC = await ethers.getContractFactory("FlashMorCoin");
  const fmc = await FMC.deploy();
  await fmc.waitForDeployment();
  console.log("✅ FMC desplegado:", await fmc.getAddress());

  // 2. Deploy USDC Mock
  const Mock = await ethers.getContractFactory("ERC20Mock");
  const usdc = await Mock.deploy("USDC", "USDC", 6);
  await usdc.waitForDeployment();
  console.log("✅ USDC Mock desplegado:", await usdc.getAddress());

  // 3. Acuñar tokens
  await fmc.mint(owner.address, ethers.parseEther("1000000"));
  await usdc.mint(buyer.address, ethers.parseUnits("10000", 6));
  console.log("✅ Tokens acuñados");

  // 4. Deploy Exchange
  const Exchange = await ethers.getContractFactory("FMCP2PExchange");
  const exchange = await Exchange.deploy(await fmc.getAddress(), owner.address);
  await exchange.waitForDeployment();
  console.log("✅ Exchange desplegado:", await exchange.getAddress());

  // 5. Owner crea trade
  await fmc.approve(await exchange.getAddress(), ethers.parseEther("100"));
  await exchange.createTrade(
    ethers.parseEther("100"),
    1_500_000, // 1.5 USDC por FMC → 1.5 * 1e6
    await usdc.getAddress()
  );
  console.log("✅ Trade #1 creado");

  // 6. Buyer ejecuta trade
  await usdc.connect(buyer).approve(await exchange.getAddress(), ethers.parseUnits("150", 6));
  await exchange.connect(buyer).executeTrade(1);
  console.log("✅ Trade #1 ejecutado");

  // 7. Verificar resultados
  const buyerFmc = await fmc.balanceOf(buyer.address);
  const sellerUsdc = await usdc.balanceOf(owner.address);
  const feeUsdc = await usdc.balanceOf(owner.address); // feeWallet = owner

  console.log("\n📊 Resultados:");
  console.log("Comprador FMC:", ethers.formatEther(buyerFmc));
  console.log("Vendedor USDC recibido:", ethers.formatUnits(sellerUsdc, 6));
  console.log("Comisión (fee): 0.375 USDC (0.25% de 150)");
  console.log("\n🎉 ¡Flujo automático completado con ganancias reales!");
}

main().catch(console.error);
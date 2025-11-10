const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  const FMC = await ethers.getContractFactory("FlashMorCoin");
  const fmc = await FMC.deploy();
  await fmc.waitForDeployment();

  // Acuñar 1M FMC
  await fmc.mint(deployer.address, ethers.parseEther("1000000"));
  
  // Desplegar USDC mock (si no confías en el de Mumbai)
  const ERC20Mock = await ethers.getContractFactory("ERC20Mock");
  const usdc = await ERC20Mock.deploy("USDC", "USDC", 6);
  await usdc.waitForDeployment();
  await usdc.mint(deployer.address, ethers.parseUnits("10000", 6)); // 10,000 USDC

  console.log("✅ Wallet financiada:");
  console.log("FMC:", await fmc.getAddress());
  console.log("USDC:", await usdc.getAddress());
}

main();
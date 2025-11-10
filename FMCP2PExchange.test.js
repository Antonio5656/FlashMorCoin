const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("FMCP2PExchange", function () {
  let FMC, USDC, Exchange, fmc, usdc, exchange;
  let owner, seller, buyer, feeWallet;
  const USDC_MUMBAI = "0xfb146E2601c5F77743E4888E75D6577C2F56bAbb"; // Mock en tests

  beforeEach(async function () {
    [owner, seller, buyer, feeWallet] = await ethers.getSigners();

    // Deploy FMC
    FMC = await ethers.getContractFactory("FlashMorCoin");
    fmc = await FMC.deploy();
    await fmc.waitForDeployment();

    // Mock USDC (ERC20 simple)
    const ERC20 = await ethers.getContractFactory("ERC20Mock");
    usdc = await ERC20.deploy("USDC", "USDC", 6);
    await usdc.waitForDeployment();

    // Mint tokens para pruebas
    await fmc.mint(seller.address, ethers.parseEther("1000"));
    await usdc.mint(buyer.address, ethers.parseUnits("1000", 6));

    // Deploy Exchange
    Exchange = await ethers.getContractFactory("FMCP2PExchange");
    exchange = await Exchange.deploy(await fmc.getAddress(), feeWallet.address);
    await exchange.waitForDeployment();

    // Aprobar tokens
    await fmc.connect(seller).approve(await exchange.getAddress(), ethers.parseEther("1000"));
    await usdc.connect(buyer).approve(await exchange.getAddress(), ethers.parseUnits("1000", 6));
  });

  it("Should create and execute a trade", async function () {
    // Crear trade: 100 FMC a 1.5 USDC cada uno → price = 1.5 * 1e6 = 1_500_000
    await exchange.connect(seller).createTrade(
      ethers.parseEther("100"),
      1_500_000,
      await usdc.getAddress()
    );

    // Ejecutar trade
    await exchange.connect(buyer).executeTrade(1);

    // Verificar saldos
    expect(await fmc.balanceOf(buyer.address)).to.equal(ethers.parseEther("100"));
    expect(await usdc.balanceOf(seller.address)).to.equal(ethers.parseUnits("149.625", 6)); // 150 - 0.25% fee
    expect(await usdc.balanceOf(feeWallet.address)).to.equal(ethers.parseUnits("0.375", 6)); // 0.25% de 150
  });
});
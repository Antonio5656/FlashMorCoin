const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("FMCVault", function () {
  let fmc, vault, oracle;
  let owner, user1, user2;
  let mockToken;

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();

    // Deploy Mock ERC20 token
    const MockToken = await ethers.getContractFactory("ERC20Mock");
    mockToken = await MockToken.deploy("Mock Token", "MOCK", ethers.utils.parseEther("1000000"));
    await mockToken.deployed();

    // Deploy FMC
    const FlashMorCoin = await ethers.getContractFactory("FlashMorCoin");
    fmc = await FlashMorCoin.deploy();
    await fmc.deployed();

    // Deploy Oracle
    const FMCOracle = await ethers.getContractFactory("FMCOracle");
    oracle = await FMCOracle.deploy();
    await oracle.deployed();

    // Deploy Vault
    const FMCVault = await ethers.getContractFactory("FMCVault");
    vault = await FMCVault.deploy(fmc.address, oracle.address);
    await vault.deployed();

    // Transfer ownership
    await fmc.transferOwnership(vault.address);

    // Whitelist mock token
    await vault.addWhitelistedToken(mockToken.address);
  });

  it("Should deposit collateral and update position", async function () {
    const depositAmount = ethers.utils.parseEther("100");
    
    // Approve and deposit
    await mockToken.connect(user1).approve(vault.address, depositAmount);
    await vault.connect(user1).depositCollateral(depositAmount, mockToken.address);

    const position = await vault.positions(user1.address);
    expect(position.collateral).to.equal(depositAmount);
  });

  it("Should mint FMC against collateral", async function () {
    const depositAmount = ethers.utils.parseEther("100");
    const mintAmount = ethers.utils.parseEther("30");

    // Deposit collateral
    await mockToken.connect(user1).approve(vault.address, depositAmount);
    await vault.connect(user1).depositCollateral(depositAmount, mockToken.address);

    // Mint FMC
    await vault.connect(user1).mintFMC(mintAmount);

    expect(await fmc.balanceOf(user1.address)).to.equal(mintAmount);
    
    const position = await vault.positions(user1.address);
    expect(position.debt).to.equal(mintAmount);
  });
});
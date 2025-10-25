const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("FlashMorCoin", function () {
  let fmc;
  let owner, user1, user2;

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();

    const FlashMorCoin = await ethers.getContractFactory("FlashMorCoin");
    fmc = await FlashMorCoin.deploy();
    await fmc.deployed();
  });

  it("Should have correct name and symbol", async function () {
    expect(await fmc.name()).to.equal("FlashMorCoin");
    expect(await fmc.symbol()).to.equal("FMC");
  });

  it("Should have 18 decimals", async function () {
    expect(await fmc.decimals()).to.equal(18);
  });

  it("Should mint initial supply to deployer", async function () {
    const ownerBalance = await fmc.balanceOf(owner.address);
    expect(ownerBalance).to.equal(ethers.utils.parseEther("1000000"));
  });

  it("Should allow owner to mint tokens", async function () {
    await fmc.mint(user1.address, ethers.utils.parseEther("1000"));
    expect(await fmc.balanceOf(user1.address)).to.equal(ethers.utils.parseEther("1000"));
  });

  it("Should not allow non-owner to mint", async function () {
    await expect(
      fmc.connect(user1).mint(user2.address, ethers.utils.parseEther("1000"))
    ).to.be.revertedWith("Ownable: caller is not the owner");
  });
});
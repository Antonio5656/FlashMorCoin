const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("FlashMorCoin", function () {
  let FMC, fmc, owner, addr1;

  beforeEach(async function () {
    [owner, addr1] = await ethers.getSigners();
    FMC = await ethers.getContractFactory("FlashMorCoin");
    fmc = await FMC.deploy();
    await fmc.waitForDeployment();
  });

  it("Should mint tokens to owner", async function () {
    await fmc.mint(owner.address, ethers.parseEther("1000"));
    expect(await fmc.balanceOf(owner.address)).to.equal(ethers.parseEther("1000"));
  });

  it("Should only allow owner or minter to mint", async function () {
    await expect(fmc.connect(addr1).mint(addr1.address, 1000))
      .to.be.revertedWith("Not authorized to mint");
  });
});
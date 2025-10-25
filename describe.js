describe("FMCVault", function () {
  it("Should deposit collateral and mint FMC", async function () {
    await vault.connect(user1).depositCollateral(depositAmount, mockToken.address);
    await vault.connect(user1).mintFMC(mintAmount);
    
    expect(await fmc.balanceOf(user1.address)).to.equal(mintAmount);
  });
});
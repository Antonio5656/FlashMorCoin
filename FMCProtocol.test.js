// test/FMCProtocol.test.js
describe("FMC Protocol", function () {
    let fmc, vault, oracle;
    let owner, user1, user2;
    
    beforeEach(async function () {
        [owner, user1, user2] = await ethers.getSigners();
        
        const FMC = await ethers.getContractFactory("FMC");
        fmc = await FMC.deploy();
        
        const Oracle = await ethers.getContractFactory("MockOracle");
        oracle = await Oracle.deploy();
        
        const Vault = await ethers.getContractFactory("FMCVault");
        vault = await Vault.deploy(fmc.address, oracle.address);
    });
    
    it("Should deposit collateral and mint FMC", async function () {
        // Depositar colateral
        await vault.connect(user1).depositCollateral(ethers.utils.parseEther("100"));
        
        // Mint FMC
        await vault.connect(user1).mintFMC(ethers.utils.parseEther("30"));
        
        expect(await fmc.balanceOf(user1.address)).to.equal(ethers.utils.parseEther("30"));
    });
    
    it("Should prevent over-minting", async function () {
        await vault.connect(user1).depositCollateral(ethers.utils.parseEther("100"));
        
        await expect(
            vault.connect(user1).mintFMC(ethers.utils.parseEther("70"))
        ).to.be.revertedWith("Exceeds max mint");
    });
});
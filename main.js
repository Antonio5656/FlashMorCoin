async function main() {
    console.log("🚀 Desplegando FlashMorCoin...");
    
    // 1. Deploy FMC Token
    const FMC = await ethers.getContractFactory("FMC");
    const fmc = await FMC.deploy();
    await fmc.deployed();
    console.log(`✅ FMC Token: ${fmc.address}`);
    
    // 2. Deploy Oracle
    const Oracle = await ethers.getContractFactory("FMCOracle");
    const oracle = await Oracle.deploy();
    await oracle.deployed();
    console.log(`✅ Oracle: ${oracle.address}`);
    
    // 3. Deploy Vault
    const Vault = await ethers.getContractFactory("FMCVault");
    const vault = await Vault.deploy(fmc.address, oracle.address);
    await vault.deployed();
    console.log(`✅ Vault: ${vault.address}`);
    
    // 4. Configurar permisos
    await fmc.transferOwnership(vault.address);
    console.log("✅ Permisos configurados");
    
    // 5. Verificar contratos
    await run("verify:verify", {
        address: fmc.address,
        constructorArguments: [],
    });
    
    console.log("🎉 Deployment completado!");
}
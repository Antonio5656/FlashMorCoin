const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Desplegando contrato P2P Exchange...");

  const [deployer] = await ethers.getSigners();
  console.log(`🔑 Desplegando con la cuenta: ${deployer.address}`);

  // Obtener la dirección del contrato FMC (ya desplegado)
  const fmcAddress = "0x..."; // Reemplazar con la dirección real de FMC

  // Desplegar P2P Exchange
  const FMCP2PExchange = await ethers.getContractFactory("FMCP2PExchange");
  const p2pExchange = await FMCP2PExchange.deploy(fmcAddress, deployer.address);
  
  await p2pExchange.deployed();
  console.log(`✅ P2P Exchange desplegado en: ${p2pExchange.address}`);

  // Guardar información del deployment
  const deploymentInfo = {
    P2PExchange: p2pExchange.address,
    network: network.name,
    deployer: deployer.address,
    timestamp: new Date().toISOString()
  };

  const fs = require("fs");
  fs.writeFileSync("deployment-p2p.json", JSON.stringify(deploymentInfo, null, 2));
  
  console.log("📄 Información de deployment P2P guardada");
  console.log("🎉 ¡Contrato P2P desplegado exitosamente!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error en deployment P2P:", error);
    process.exit(1);
  });
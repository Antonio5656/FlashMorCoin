// En hardhat.config.js - PARA DEPLOYMENT
module.exports = {
  networks: {
    mumbai: {
      url: `https://polygon-mumbai.g.alchemy.com/v2/TU_API_KEY`,
      accounts: [process.env.PRIVATE_KEY]
    }
  }
}

// En frontend - PARA INTERACCIÓN EN TIEMPO REAL
const ALCHEMY_URL = "https://polygon-mumbai.g.alchemy.com/v2/TU_API_KEY";
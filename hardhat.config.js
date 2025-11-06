// hardhat.config.js
require('@nomiclabs/hardhat-waffle');

module.exports = {
  solidity: "0.8.9",
  networks: {
    mumbai: {
      url: `https://polygon-mumbai.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`, // Use your API key here
      accounts: [process.env.PRIVATE_KEY] // Your wallet's private key
    }
  }
};
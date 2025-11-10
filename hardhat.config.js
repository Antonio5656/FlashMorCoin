// hardhat.config.js
require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const { API_URL, PRIVATE_KEY } = process.env;

module.exports = {
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    hardhat: {},
    mumbai: {



      url: API_URL || "https://polygon-mumbai.infura.io/v3/YOUR-PROJECT-ID",
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
POLYGON_MUMBAI_URL=https://polygon-mumbai.infura.io/v3/4df8eead51294cd09eadf4b51efaa014
POLYGONSCAN_API_KEY=01b_Lg_ZvjpnKoQGgqGlT


    },
    sepolia: {
      url: API_URL || "https://sepolia.infura.io/v3/YOUR-PROJECT-ID",
      accounts: PRIVATE_KEY ? [4df8eead51294cd09eadf4b51efaa014] : [],

# Si usas Sepolia:
SEPOLIA_URL=https://sepolia.infura.io/v3/4df8eead51294cd09eadf4b51efaa014
ETHERSCAN_API_KEY=your_etherscan_api_key_here

    }
  },

  etherscan: {


    apiKey: process.env.POLYGONSCAN_API_KEY || process.env.ETHERSCAN_API_KEY

      # Paste this in your .env file
NEXT_PUBLIC_ALCHEMY_API_KEY=01b_Lg_ZvjpnKoQGgqGlT
NEXT_PUBLIC_ALCHEMY_POLICY_ID=4b1409cc-8f15-4566-92b8-a397ea6f79e0


  }
};
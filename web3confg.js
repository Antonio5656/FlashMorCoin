require('@nomiclabs/hardhat-waffle');

module.exports = {
  networks: {
    mumbai: {
      url: `https://polygon-mumbai.g.alchemy.com/v2/${process.env.b55QwUhpStn9Bq05tJlOk}`,
      accounts: [process.env.b55QwUhpStn9Bq05tJlOk]
    }
  }
};
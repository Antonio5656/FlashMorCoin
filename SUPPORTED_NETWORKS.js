// En this.SUPPORTED_NETWORKS, añadimos wNative para cada red:
this.SUPPORTED_NETWORKS = {
    1: { 
        name: 'Ethereum Mainnet', 
        symbol: 'ETH', 
        explorer: 'https://etherscan.io',
        optimal: false,
        priority: 2,
        wNative: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2' // WETH
    },
    56: { 
        name: 'BSC Mainnet', 
        symbol: 'BNB', 
        explorer: 'https://bscscan.com',
        optimal: false,
        priority: 3,
        wNative: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c' // WBNB
    },
    // ... otras redes
};
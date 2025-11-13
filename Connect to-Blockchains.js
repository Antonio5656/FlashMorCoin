// Define the networks you support
const SUPPORTED_NETWORKS = {
    1: { name: 'Ethereum Mainnet', symbol: 'ETH' },
    137: { name: 'Polygon Mainnet', symbol: 'MATIC' },
    56: { name: 'Binance Smart Chain', symbol: 'BNB' },
    42161: { name: 'Arbitrum One', symbol: 'ETH' },
    // Add other networks you want to support
};

// Check the current network and prompt to switch if needed
async function checkAndSwitchNetwork() {
    if (!window.ethereum) return;
    
    const chainId = await window.ethereum.request({ method: 'eth_chainId' });
    const targetNetwork = '0x1'; // Example: Ethereum Mainnet
    
    if (chainId !== targetNetwork) {
        try {
            // Request to switch to the target network
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: targetNetwork }],
            });
        } catch (switchError) {
            // This error code means the chain hasn't been added to the wallet yet
            if (switchError.code === 4902) {
                try {
                    await window.ethereum.request({
                        method: 'wallet_addEthereumChain',
                        params: [{
                            chainId: targetNetwork,
                            chainName: 'Ethereum Mainnet',
                            rpcUrls: ['https://mainnet.infura.io/v3/...'] /* Your RPC URL */,
                            nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
                            blockExplorerUrls: ['https://etherscan.io']
                        }],
                    });
                } catch (addError) {
                    console.error("User refused to add the network");
                }
            }
        }
    }
}
// Function to detect available wallet providers
function detectWalletProviders() {
    const providers = [];
    if (typeof window.ethereum !== 'undefined') {
        // Check for specific wallets that inject their own API
        if (window.ethereum.isMetaMask) providers.push('MetaMask');
        if (window.ethereum.isCoinbaseWallet) providers.push('Coinbase Wallet');
        if (window.ethereum.isBraveWallet) providers.push('Brave Wallet');
        // Add checks for other wallets like Trust Wallet, etc.
    }
    // Check for other independent wallet objects if needed
    if (typeof window.phantom !== 'undefined') providers.push('Phantom');
    return providers;
}

// On page load, show available wallets
window.addEventListener('load', function() {
    const availableWallets = detectWalletProviders();
    // Update your UI to show the available wallets for the user to choose from
    console.log("Available Wallets:", availableWallets);
});



// Tokens whitelisted como colateral
mapping(address => bool) public whitelistedTokens;

function addWhitelistedToken(address token) external onlyOwner {
    whitelistedTokens[token] = true;
}

// Tokens iniciales soportados
function initializeWhitelist() external onlyOwner {
    // LP Tokens de QuickSwap
    whitelistedTokens[0x5e82fFB6D411dbd1962103867bAfc6f7D8304D64] = true;
    whitelistedTokens[0x5e82fFB6D411dbd1962103867bAfc6f7D8304D64] = true;
    
    // Stablecoins para precios
    whitelistedTokens[0x5e82fFB6D411dbd1962103867bAfc6f7D8304D64] = true; // USDC
    whitelistedTokens[0x5e82fFB6D411dbd1962103867bAfc6f7D8304D64] = true; // DAI
}
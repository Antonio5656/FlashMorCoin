


// Tokens whitelisted como colateral
mapping(address => bool) public whitelistedTokens;

function addWhitelistedToken(address token) external onlyOwner {
    whitelistedTokens[token] = true;
}

// Tokens iniciales soportados
function initializeWhitelist() external onlyOwner {
    // LP Tokens de QuickSwap
    whitelistedTokens[0x5774808c2856f7FDF1A0a8F375A41559794BeF6B] = true;
    whitelistedTokens[0x5774808c2856f7FDF1A0a8F375A41559794BeF6B] = true;
    
    // Stablecoins para precios
    whitelistedTokens[0x5774808c2856f7FDF1A0a8F375A41559794BeF6B] = true; // USDC
    whitelistedTokens[0x5774808c2856f7FDF1A0a8F375A41559794BeF6B] = true; // DAI
}
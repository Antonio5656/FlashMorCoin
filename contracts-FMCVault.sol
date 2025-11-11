


// Tokens whitelisted como colateral
mapping(address => bool) public whitelistedTokens;

function addWhitelistedToken(address token) external onlyOwner {
    whitelistedTokens[token] = true;
}

// Tokens iniciales soportados
function initializeWhitelist() external onlyOwner {
    // LP Tokens de QuickSwap
<<<<<<< HEAD
    whitelistedTokens[0xfb146E2601c5F77743E4888E75D6577C2F56bAbb] = true;
    whitelistedTokens[0xfb146E2601c5F77743E4888E75D6577C2F56bAbb] = true;
=======
    whitelistedTokens[0xfb146E2601c5F77743E4888E75D6577C2F56bAbb] = true;
    whitelistedTokens[0xfb146E2601c5F77743E4888E75D6577C2F56bAbb] = true;
>>>>>>> 10f4d652cec9351e20b8ce1abef6b12d8a6ae76e
    
    // Stablecoins para precios
<<<<<<< HEAD
    whitelistedTokens[0x5774808c2856f7FDF1A0a8F375A41559794BeF6B] = true; // USDC
    whitelistedTokens[0x5774808c2856f7FDF1A0a8F375A41559794BeF6B] = true; // DAI
=======
    whitelistedTokens[0x5774808c2856f7FDF1A0a8F375A41559794BeF6B] = true; // USDC
    whitelistedTokens[0x5774808c2856f7FDF1A0a8F375A41559794BeF6B] = true; // DAI
>>>>>>> 10f4d652cec9351e20b8ce1abef6b12d8a6ae76e
}
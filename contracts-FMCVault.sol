


// Tokens whitelisted como colateral
mapping(address => bool) public whitelistedTokens;

function addWhitelistedToken(address token) external onlyOwner {
    whitelistedTokens[token] = true;
}

// Tokens iniciales soportados
function initializeWhitelist() external onlyOwner {
    // LP Tokens de QuickSwap
    whitelistedTokens[0xfb146E2601c5F77743E4888E75D6577C2F56bAbb] = true;
    whitelistedTokens[0x0371b4dcB192905C9010B2699a061D186AAFf205] = true;
    
    // Stablecoins para precios
    whitelistedTokens[0x5774808c2856f7FDF1A0a8F375A41559794BeF6B] = true; // USDC
    whitelistedTokens[0x5774808c2856f7FDF1A0a8F375A41559794BeF6B] = true; // DAI
}
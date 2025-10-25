// FlashMorCoin.sol - Token ERC-20
contract FlashMorCoin is ERC20, Ownable {
    function mint(address to, uint256 amount) external onlyOwner
    function burn(address from, uint256 amount) external onlyOwner
}

// FMCVault.sol - Contrato principal
contract FMCVault is ReentrancyGuard {
    function depositCollateral(uint256 amount, address token)
    function mintFMC(uint256 amount) 
    function repayFMC(uint256 amount)
    function withdrawCollateral(uint256 amount)
}

// FMCOracle.sol - Oracle de precios  
contract FMCOracle {
    function getTokenValue(address token, uint256 amount)
    function getLPValue(address lpToken, uint256 amount)
}
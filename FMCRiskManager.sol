// contracts/FMCRiskManager.sol
contract FMCRiskManager {
    mapping(address => bool) public whitelistedLPTokens;
    mapping(address => uint256) public maxLTV;
    
    uint256 public liquidationThreshold = 7500; // 75%
    uint256 public healthFactorSafe = 15000; // 1.5x
    
    function canLiquidate(address user) public view returns (bool) {
        uint256 healthFactor = calculateHealthFactor(user);
        return healthFactor < liquidationThreshold;
    }
    
    function calculateHealthFactor(address user) public view returns (uint256) {
        Position memory pos = vault.positions(user);
        if (pos.debt == 0) return type(uint256).max;
        
        uint256 collateralValue = oracle.getLPPrice(pos.collateralToken);
        return (collateralValue * healthFactorSafe) / pos.debt;
    }
}
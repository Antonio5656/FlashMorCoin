// contracts/FMCTreasury.sol
contract FMCTreasury {
    uint256 public protocolFee = 30; // 0.3%
    uint256 public stabilityPoolFee = 20; // 0.2%
    
    address public protocolWallet;
    address public stabilityPool;
    
    function distributeFees(uint256 amount) external {
        uint256 protocolAmount = (amount * protocolFee) / 10000;
        uint256 stabilityAmount = (amount * stabilityPoolFee) / 10000;
        
        IERC20(fmcToken).transfer(protocolWallet, protocolAmount);
        IERC20(fmcToken).transfer(stabilityPool, stabilityAmount);
    }
}
// contracts/FMCStabilizer.sol
contract FMCStabilizer {
    uint256 public targetPrice = 1e18; // 1 FMC = 1 USDC
    uint256 public stabilityFee = 50; // 0.5% anual
    
    function calculateStabilityFee(uint256 debt, uint256 timeElapsed) 
        public view returns (uint256) {
        return (debt * stabilityFee * timeElapsed) / (365 days * 10000);
    }
}
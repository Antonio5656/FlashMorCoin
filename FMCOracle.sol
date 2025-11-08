// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./interfaces/IPriceFeed.sol";
import "./interfaces/IUniswapV2.sol";

contract FMCOracle is IPriceFeed {
    address public constant USDC = 0xfb146E2601c5F77743E4888E75D6577C2F56bAbb;
    address public constant WMATIC = 0xfb146E2601c5F77743E4888E75D6577C2F56bAbb;
    
    mapping(address => address) public priceFeeds;
    
    function getTokenValue(address token, uint256 amount) external view override returns (uint256) {
        // Precio simple usando Uniswap V2 como ejemplo
        if (token == USDC) {
            return amount; // 1:1 para USDC
        }
        
        // Para LP tokens, calcular valor basado en reservas
        return getLPValue(token, amount);
    }
    
    function getLPValue(address lpToken, uint256 amount) internal view returns (uint256) {
        IUniswapV2Pair pair = IUniswapV2Pair(lpToken);
        (uint112 reserve0, uint112 reserve1,) = pair.getReserves();
        uint256 totalSupply = pair.totalSupply();
        
        address token0 = pair.token0();
        address token1 = pair.token1();
        
        uint256 value0 = (reserve0 * amount * 2) / totalSupply;
        uint256 value1 = (reserve1 * amount * 2) / totalSupply;
        
        return value0 + value1;
    }
    
    function setPriceFeed(address token, address feed) external {
        priceFeeds[token] = feed;
    }
}
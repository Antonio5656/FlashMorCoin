// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./interfaces/IPriceFeed.sol";
import "./interfaces/IUniswapV2.sol";

contract FMCOracle is IPriceFeed {
    address public constant USDC = 0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174;
    address public constant WMATIC = 0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270;
    
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
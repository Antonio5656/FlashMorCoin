// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./FlashMorCoin.sol";
import "./interfaces/IPriceFeed.sol";

contract FMCVault is ReentrancyGuard {
    using SafeERC20 for IERC20;
    
    FlashMorCoin public fmcToken;
    IPriceFeed public priceFeed;
    address public owner;
    
    uint256 public constant LTV_RATIO = 6000; // 60%
    uint256 public constant LIQUIDATION_THRESHOLD = 8000; // 80%
    uint256 public constant FEE_RATE = 100; // 1%
    
    struct Position {
        uint256 collateral;
        uint256 debt;
        address collateralToken;
        uint256 lastUpdate;
    }
    
    mapping(address => Position) public positions;
    mapping(address => bool) public whitelistedTokens;
    
    event Deposited(address indexed user, uint256 amount, address token);
    event Minted(address indexed user, uint256 amount);
    event Repaid(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);
    event Liquidated(address indexed user, address liquidator, uint256 amount);
    
    constructor(address _fmcToken, address _priceFeed) {
        fmcToken = FlashMorCoin(_fmcToken);
        priceFeed = IPriceFeed(_priceFeed);
        owner = msg.sender;
    }
    
    function depositCollateral(uint256 amount, address token) external nonReentrant {
        require(whitelistedTokens[token], "Token not whitelisted");
        require(amount > 0, "Amount must be greater than 0");
        
        IERC20(token).safeTransferFrom(msg.sender, address(this), amount);
        
        Position storage position = positions[msg.sender];
        position.collateral += amount;
        position.collateralToken = token;
        position.lastUpdate = block.timestamp;
        
        emit Deposited(msg.sender, amount, token);
    }
    
    function mintFMC(uint256 amount) external nonReentrant {
        require(amount > 0, "Amount must be greater than 0");
        require(amount <= getMaxMint(msg.sender), "Exceeds max mint");
        
        Position storage position = positions[msg.sender];
        position.debt += amount;
        position.lastUpdate = block.timestamp;
        
        fmcToken.mint(msg.sender, amount);
        emit Minted(msg.sender, amount);
    }
    
    function repayFMC(uint256 amount) external nonReentrant {
        require(amount > 0, "Amount must be greater than 0");
        
        Position storage position = positions[msg.sender];
        require(amount <= position.debt, "Repay amount exceeds debt");
        
        fmcToken.burn(msg.sender, amount);
        position.debt -= amount;
        position.lastUpdate = block.timestamp;
        
        emit Repaid(msg.sender, amount);
    }
    
    function withdrawCollateral(uint256 amount) external nonReentrant {
        require(amount > 0, "Amount must be greater than 0");
        
        Position storage position = positions[msg.sender];
        require(amount <= position.collateral, "Insufficient collateral");
        require(getHealthFactor(msg.sender) >= LIQUIDATION_THRESHOLD, "Health factor too low");
        
        position.collateral -= amount;
        position.lastUpdate = block.timestamp;
        
        IERC20(position.collateralToken).safeTransfer(msg.sender, amount);
        emit Withdrawn(msg.sender, amount);
    }
    
    function getMaxMint(address user) public view returns (uint256) {
        Position memory position = positions[user];
        if (position.collateral == 0) return 0;
        
        uint256 collateralValue = priceFeed.getTokenValue(position.collateralToken, position.collateral);
        uint256 maxDebt = (collateralValue * LTV_RATIO) / 10000;
        uint256 available = maxDebt > position.debt ? maxDebt - position.debt : 0;
        
        return available;
    }
    
    function getHealthFactor(address user) public view returns (uint256) {
        Position memory position = positions[user];
        if (position.debt == 0) return type(uint256).max;
        
        uint256 collateralValue = priceFeed.getTokenValue(position.collateralToken, position.collateral);
        return (collateralValue * 10000) / position.debt;
    }
    
    function addWhitelistedToken(address token) external {
        require(msg.sender == owner, "Only owner");
        whitelistedTokens[token] = true;
    }
}
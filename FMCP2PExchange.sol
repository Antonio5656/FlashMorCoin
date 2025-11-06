// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./FlashMorCoin.sol";

contract FMCP2PExchange is ReentrancyGuard, Ownable {
    FlashMorCoin public fmcToken;
    
    struct Trade {
        uint256 id;
        address seller;
        address buyer;
        uint256 amount;
        uint256 price; // Precio en USDC o token base
        address paymentToken;
        bool isActive;
        bool isCompleted;
        uint256 createdAt;
        uint256 completedAt;
    }
    
    uint256 public tradeCounter;
    mapping(uint256 => Trade) public trades;
    mapping(address => bool) public allowedPaymentTokens;
    
    uint256 public platformFee = 25; // 0.25%
    address public feeWallet;
    
    event TradeCreated(
        uint256 indexed tradeId,
        address indexed seller,
        uint256 amount,
        uint256 price,
        address paymentToken
    );
    
    event TradeCompleted(
        uint256 indexed tradeId,
        address indexed buyer,
        uint256 amount,
        uint256 totalPrice
    );
    
    event TradeCancelled(uint256 indexed tradeId);
    
    constructor(address _fmcToken, address _feeWallet) {
        fmcToken = FlashMorCoin(_fmcToken);
        feeWallet = _feeWallet;
        
        // Tokens de pago permitidos (USDC, DAI, etc.)
        allowedPaymentTokens[0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174] = true; // USDC
        allowedPaymentTokens[0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063] = true; // DAI
    }
    
    function createTrade(
        uint256 amount,
        uint256 price,
        address paymentToken
    ) external nonReentrant {
        require(amount > 0, "Amount must be greater than 0");
        require(price > 0, "Price must be greater than 0");
        require(allowedPaymentTokens[paymentToken], "Payment token not allowed");
        
        // Transferir FMC del vendedor al contrato (escrow)
        require(
            fmcToken.transferFrom(msg.sender, address(this), amount),
            "FMC transfer failed"
        );
        
        tradeCounter++;
        trades[tradeCounter] = Trade({
            id: tradeCounter,
            seller: msg.sender,
            buyer: address(0),
            amount: amount,
            price: price,
            paymentToken: paymentToken,
            isActive: true,
            isCompleted: false,
            createdAt: block.timestamp,
            completedAt: 0
        });
        
        emit TradeCreated(tradeCounter, msg.sender, amount, price, paymentToken);
    }
    
    function executeTrade(uint256 tradeId) external nonReentrant {
        Trade storage trade = trades[tradeId];
        require(trade.isActive, "Trade not active");
        require(!trade.isCompleted, "Trade already completed");
        require(msg.sender != trade.seller, "Cannot buy your own trade");
        
        uint256 totalPrice = trade.amount * trade.price / 1e18;
        uint256 fee = totalPrice * platformFee / 10000;
        uint256 sellerAmount = totalPrice - fee;
        
        // Transferir token de pago del comprador al vendedor
        IERC20 paymentToken = IERC20(trade.paymentToken);
        require(
            paymentToken.transferFrom(msg.sender, trade.seller, sellerAmount),
            "Payment transfer failed"
        );
        
        // Transferir fee a la wallet de fees
        if (fee > 0) {
            require(
                paymentToken.transferFrom(msg.sender, feeWallet, fee),
                "Fee transfer failed"
            );
        }
        
        // Transferir FMC al comprador
        require(
            fmcToken.transfer(msg.sender, trade.amount),
            "FMC transfer to buyer failed"
        );
        
        trade.buyer = msg.sender;
        trade.isActive = false;
        trade.isCompleted = true;
        trade.completedAt = block.timestamp;
        
        emit TradeCompleted(tradeId, msg.sender, trade.amount, totalPrice);
    }
    
    function cancelTrade(uint256 tradeId) external nonReentrant {
        Trade storage trade = trades[tradeId];
        require(trade.isActive, "Trade not active");
        require(msg.sender == trade.seller, "Only seller can cancel");
        
        // Devolver FMC al vendedor
        require(
            fmcToken.transfer(trade.seller, trade.amount),
            "FMC return failed"
        );
        
        trade.isActive = false;
        
        emit TradeCancelled(tradeId);
    }
    
    function getActiveTrades() external view returns (Trade[] memory) {
        uint256 activeCount = 0;
        for (uint256 i = 1; i <= tradeCounter; i++) {
            if (trades[i].isActive) {
                activeCount++;
            }
        }
        
        Trade[] memory activeTrades = new Trade[](activeCount);
        uint256 currentIndex = 0;
        for (uint256 i = 1; i <= tradeCounter; i++) {
            if (trades[i].isActive) {
                activeTrades[currentIndex] = trades[i];
                currentIndex++;
            }
        }
        return activeTrades;
    }
    
    function addPaymentToken(address token) external onlyOwner {
        allowedPaymentTokens[token] = true;
    }
    
    function setPlatformFee(uint256 _fee) external onlyOwner {
        require(_fee <= 100, "Fee too high"); // Máximo 1%
        platformFee = _fee;
    }
}
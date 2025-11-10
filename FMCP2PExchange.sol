// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

// Asumimos que FlashMorCoin es un ERC20 estándar (18 decimales)
import "./FlashMorCoin.sol";

contract FMCP2PExchange is ReentrancyGuard, Ownable {
    using SafeERC20 for IERC20;

    FlashMorCoin public immutable fmcToken;
    address public feeWallet;
    uint256 public platformFeeBasisPoints; // 25 = 0.25%, 100 = 1%

    struct Trade {
        uint256 id;
        address seller;
        address buyer;
        uint256 fmcAmount;          // En unidades de FMC (18 decimales)
        uint256 pricePerFmcInPaymentToken; // Precio por 1 FMC, en unidades del token de pago (ej. 1.5 USDC = 1_500_000 si USDC tiene 6 decimales)
        address paymentToken;       // Ej: USDC, DAI
        bool isActive;
        bool isCompleted;
        uint256 createdAt;
    }

    uint256 public tradeCounter;
    mapping(uint256 => Trade) public trades;
    mapping(address => bool) public allowedPaymentTokens;

    event TradeCreated(
        uint256 indexed tradeId,
        address indexed seller,
        uint256 fmcAmount,
        uint256 pricePerFmcInPaymentToken,
        address paymentToken
    );

    event TradeCompleted(
        uint256 indexed tradeId,
        address indexed buyer,
        uint256 fmcAmount,
        uint256 totalPaymentSent,
        uint256 platformFee
    );

    event TradeCancelled(uint256 indexed tradeId);

    constructor(address _fmcToken, address _feeWallet) {
        require(_fmcToken != address(0), "Invalid FMC token");
        require(_feeWallet != address(0), "Invalid fee wallet");
        fmcToken = FlashMorCoin(_fmcToken);
        feeWallet = _feeWallet;
        platformFeeBasisPoints = 25; // 0.25%

        // Tokens permitidos (Polygon USDC y DAI como ejemplo)
        allowedPaymentTokens[0x5774808c2856f7FDF1A0a8F375A41559794BeF6B] = true; // USDC (6 decimales)
        allowedPaymentTokens[0x5774808c2856f7FDF1A0a8F375A41559794BeF6B] = true; // DAI (18 decimales)
    }

    function createTrade(
        uint256 fmcAmount,
        uint256 pricePerFmcInPaymentToken,
        address paymentToken
    ) external nonReentrant {
        require(fmcAmount > 0, "FMC amount must be > 0");
        require(pricePerFmcInPaymentToken > 0, "Price must be > 0");
        require(allowedPaymentTokens[paymentToken], "Payment token not allowed");

        // El vendedor debe tener y aprobar FMC al contrato
        require(
            fmcToken.transferFrom(msg.sender, address(this), fmcAmount),
            "FMC transfer failed"
        );

        tradeCounter++;
        trades[tradeCounter] = Trade({
            id: tradeCounter,
            seller: msg.sender,
            buyer: address(0),
            fmcAmount: fmcAmount,
            pricePerFmcInPaymentToken: pricePerFmcInPaymentToken,
            paymentToken: paymentToken,
            isActive: true,
            isCompleted: false,
            createdAt: block.timestamp
        });

        emit TradeCreated(tradeCounter, msg.sender, fmcAmount, pricePerFmcInPaymentToken, paymentToken);
    }

    function executeTrade(uint256 tradeId) external nonReentrant {
        Trade storage trade = trades[tradeId];
        require(trade.isActive, "Trade not active");
        require(msg.sender != trade.seller, "Cannot buy your own trade");

        // Calcular el total en token de pago que el comprador debe pagar
        // total = (fmcAmount * pricePerFmc) / 1e18   → porque FMC tiene 18 decimales
        uint256 totalPayment = (trade.fmcAmount * trade.pricePerFmcInPaymentToken) / 1e18;
        require(totalPayment > 0, "Total payment must be > 0");

        uint256 fee = (totalPayment * platformFeeBasisPoints) / 10_000;
        uint256 sellerAmount = totalPayment - fee;

        IERC20 paymentToken = IERC20(trade.paymentToken);

        // El comprador debe aprobar TOTAL al contrato
        paymentToken.safeTransferFrom(msg.sender, trade.seller, sellerAmount);
        if (fee > 0) {
            paymentToken.safeTransferFrom(msg.sender, feeWallet, fee);
        }

        // Entregar FMC al comprador
        fmcToken.safeTransfer(msg.sender, trade.fmcAmount);

        trade.buyer = msg.sender;
        trade.isActive = false;
        trade.isCompleted = true;

        emit TradeCompleted(tradeId, msg.sender, trade.fmcAmount, totalPayment, fee);
    }

    function cancelTrade(uint256 tradeId) external nonReentrant {
        Trade storage trade = trades[tradeId];
        require(trade.isActive, "Trade not active");
        require(msg.sender == trade.seller, "Only seller can cancel");

        fmcToken.safeTransfer(trade.seller, trade.fmcAmount);
        trade.isActive = false;

        emit TradeCancelled(tradeId);
    }

    function addPaymentToken(address token) external onlyOwner {
        require(token != address(0), "Invalid token");
        allowedPaymentTokens[token] = true;
    }

    function setPlatformFee(uint256 basisPoints) external onlyOwner {
        require(basisPoints <= 1000, "Max 10%"); // 1000 = 10%
        platformFeeBasisPoints = basisPoints;
    }

    function setFeeWallet(address _feeWallet) external onlyOwner {
        require(_feeWallet != address(0), "Invalid wallet");
        feeWallet = _feeWallet;
    }

    function getActiveTradesCount() external view returns (uint256) {
        // Si necesitas eficiencia, podrías usar un array gestionado
        // Pero para simplicidad, devuelve tradeCounter y filtra en frontend
        return tradeCounter;
    }
}
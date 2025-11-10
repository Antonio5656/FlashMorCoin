// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./FlashMorCoin.sol";

contract FMCPresale is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;
    using SafeERC20 for FlashMorCoin;

    // Tokens
    FlashMorCoin public immutable fmcToken;
    IERC20 public immutable paymentToken; // Ej: USDC

    // Configuración
    uint256 public fmcPricePerToken; // Cuántos FMC da por 1 unidad del paymentToken (escalado a decimales del paymentToken)
    uint256 public platformCommissionBps; // Comisión en basis points (500 = 5%)
    uint256 public minContribution;
    uint256 public maxContribution;
    uint256 public presaleStart;
    uint256 public presaleEnd;
    bool public isTgeDone;

    // Fondos y ventas
    uint256 public totalRaised;
    uint256 public totalFmcSold;
    address public treasuryWallet; // Donde van los fondos recaudados
    address public platformWallet; // Donde va la comisión

    // Participaciones
    mapping(address => uint256) public contributions;
    mapping(address => uint256) public fmcPending;

    event Contribution(address indexed user, uint256 paymentAmount, uint256 fmcAmount);
    event TgeExecuted(uint256 totalFmcDistributed);
    event FundsWithdrawn(address indexed to, uint256 amount);

    constructor(
        address _fmcToken,
        address _paymentToken,
        address _treasuryWallet,
        address _platformWallet
    ) {
        require(_fmcToken != address(0), "Invalid FMC");
        require(_paymentToken != address(0), "Invalid payment token");
        require(_treasuryWallet != address(0), "Invalid treasury");
        require(_platformWallet != address(0), "Invalid platform wallet");

        fmcToken = FlashMorCoin(_fmcToken);
        paymentToken = IERC20(_paymentToken);
        treasuryWallet = _treasuryWallet;
        platformWallet = _platformWallet;

        // Configuración por defecto (puedes cambiar con funciones onlyOwner)
        fmcPricePerToken = 1000 * 1e18; // 1 USDC = 1000 FMC → ajusta según tu modelo
        platformCommissionBps = 500;    // 5%
        minContribution = 10 * 1e6;     // 10 USDC mínimo (USDC = 6 decimales)
        maxContribution = 10000 * 1e6;  // 10,000 USDC máximo
        presaleStart = block.timestamp + 1 days;
        presaleEnd = presaleStart + 30 days;
    }

    function contribute(uint256 paymentAmount) external nonReentrant {
        require(block.timestamp >= presaleStart, "Presale not started");
        require(block.timestamp < presaleEnd, "Presale ended");
        require(paymentAmount >= minContribution, "Below min contribution");
        require(contributions[msg.sender] + paymentAmount <= maxContribution, "Exceeds max contribution");

        // Transferir paymentToken al contrato
        paymentToken.safeTransferFrom(msg.sender, address(this), paymentAmount);

        // Calcular FMC a entregar: (paymentAmount * fmcPricePerToken) / (10^decimales del paymentToken)
        // Pero como fmcPricePerToken ya está en FMC por unidad de paymentToken, y FMC tiene 18 decimales:
        uint256 fmcAmount = (paymentAmount * fmcPricePerToken) / (10 ** _getPaymentTokenDecimals());

        require(fmcAmount > 0, "No FMC to receive");

        contributions[msg.sender] += paymentAmount;
        fmcPending[msg.sender] += fmcAmount;
        totalRaised += paymentAmount;
        totalFmcSold += fmcAmount;

        emit Contribution(msg.sender, paymentAmount, fmcAmount);
    }

    function executeTge() external onlyOwner {
        require(!isTgeDone, "TGE already done");
        require(block.timestamp >= presaleEnd, "Presale not finished");

        isTgeDone = true;

        // Calcular comisión de la plataforma: 5% del total recaudado
        uint256 platformFee = (totalRaised * platformCommissionBps) / 10_000;
        uint256 netRaised = totalRaised - platformFee;

        // Enviar fondos
        paymentToken.safeTransfer(treasuryWallet, netRaised);
        if (platformFee > 0) {
            paymentToken.safeTransfer(platformWallet, platformFee);
        }

        emit TgeExecuted(totalFmcSold);
        emit FundsWithdrawn(treasuryWallet, netRaised);
        if (platformFee > 0) {
            emit FundsWithdrawn(platformWallet, platformFee);
        }
    }

    function withdrawFmc() external nonReentrant {
        require(isTgeDone, "TGE not executed");
        uint256 amount = fmcPending[msg.sender];
        require(amount > 0, "No FMC to withdraw");

        fmcPending[msg.sender] = 0;
        fmcToken.safeTransfer(msg.sender, amount);
    }

    // --- Funciones de administración ---

    function updateSettings(
        uint256 _fmcPricePerToken,
        uint256 _min,
        uint256 _max,
        uint256 _start,
        uint256 _end
    ) external onlyOwner {
        fmcPricePerToken = _fmcPricePerToken;
        minContribution = _min;
        maxContribution = _max;
        presaleStart = _start;
        presaleEnd = _end;
    }

    function setPlatformCommission(uint256 _bps) external onlyOwner {
        require(_bps <= 1000, "Max 10%");
        platformCommissionBps = _bps;
    }

    function emergencyWithdrawToken(address token, uint256 amount) external onlyOwner {
        if (token == address(fmcToken)) {
            fmcToken.safeTransfer(owner(), amount);
        } else {
            IERC20(token).safeTransfer(owner(), amount);
        }
    }

    // --- Helpers ---

    function _getPaymentTokenDecimals() internal view returns (uint8) {
        // USDC = 6, DAI = 18, etc.
        // En lugar de asumir, podrías almacenar los decimales en una variable durante el constructor
        // Pero para simplicidad y seguridad, asumimos que conoces el token
        // Alternativa: usar una función view que lo consulte (pero consume más gas)
        return IERC20Metadata(address(paymentToken)).decimals();
    }

    function getPendingFmc(address user) external view returns (uint256) {
        return fmcPending[user];
    }

    function getContribution(address user) external view returns (uint256) {
        return contributions[user];
    }
}

// Interfaz mínima para obtener decimales
interface IERC20Metadata is IERC20 {
    function decimals() external view returns (uint8);
}
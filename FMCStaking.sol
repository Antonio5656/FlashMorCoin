// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

import "./FlashMorCoin.sol";

contract FMCStaking is Ownable, ReentrancyGuard {
    using SafeERC20 for FlashMorCoin;

    FlashMorCoin public immutable fmcToken;
    address public rewardWallet;      // De donde salen las recompensas
    address public platformWallet;    // Para comisión de la plataforma (opcional)
    uint256 public rewardRatePerSecond; // Recompensa por segundo por cada 1e18 FMC staked
    uint256 public platformCommissionBps; // Comisión en basis points (25 = 0.25%)

    mapping(address => uint256) public userStaked;
    mapping(address => uint256) public userRewardDebt;

    uint256 public totalStaked;
    uint256 public lastUpdateTime;

    event Staked(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount, uint256 reward);
    event RewardRateUpdated(uint256 newRate);
    event PlatformCommissionSet(uint256 bps);

    constructor(address _fmcToken, address _rewardWallet, address _platformWallet) {
        require(_fmcToken != address(0), "Invalid FMC");
        require(_rewardWallet != address(0), "Invalid reward wallet");
        require(_platformWallet != address(0), "Invalid platform wallet");

        fmcToken = FlashMorCoin(_fmcToken);
        rewardWallet = _rewardWallet;
        platformWallet = _platformWallet;
        lastUpdateTime = block.timestamp;
        platformCommissionBps = 25; // 0.25% de comisión en rewards
    }

    function setRewardRate(uint256 _rate) external onlyOwner {
        _updateRewards();
        rewardRatePerSecond = _rate;
        emit RewardRateUpdated(_rate);
    }

    function setPlatformCommission(uint256 _bps) external onlyOwner {
        require(_bps <= 1000, "Max 10%");
        platformCommissionBps = _bps;
        emit PlatformCommissionSet(_bps);
    }

    function setRewardWallet(address _wallet) external onlyOwner {
        require(_wallet != address(0), "Invalid");
        rewardWallet = _wallet;
    }

    function stake(uint256 amount) external nonReentrant {
        require(amount > 0, "Amount > 0");
        _updateRewards();

        uint256 userReward = _calculatePendingReward(msg.sender);
        _payReward(msg.sender, userReward);

        fmcToken.safeTransferFrom(msg.sender, address(this), amount);
        userStaked[msg.sender] += amount;
        totalStaked += amount;

        emit Staked(msg.sender, amount);
    }

    function withdraw(uint256 amount) external nonReentrant {
        require(amount > 0, "Amount > 0");
        require(userStaked[msg.sender] >= amount, "Not enough staked");

        _updateRewards();
        uint256 userReward = _calculatePendingReward(msg.sender);
        _payReward(msg.sender, userReward);

        userStaked[msg.sender] -= amount;
        totalStaked -= amount;
        fmcToken.safeTransfer(msg.sender, amount);

        emit Withdrawn(msg.sender, amount, userReward);
    }

    function withdrawReward() external nonReentrant {
        _updateRewards();
        uint256 userReward = _calculatePendingReward(msg.sender);
        require(userReward > 0, "No rewards");
        _payReward(msg.sender, userReward);
        emit Withdrawn(msg.sender, 0, userReward);
    }

    function _updateRewards() internal {
        if (block.timestamp == lastUpdateTime || totalStaked == 0) {
            lastUpdateTime = block.timestamp;
            return;
        }

        uint256 rewardPerTokenStored = rewardRatePerSecond * (block.timestamp - lastUpdateTime) * 1e18 / totalStaked;
        // Acumulador global de recompensas por token staked
        // (En implementaciones avanzadas, usarías una variable global `rewardPerTokenStored`)
        // Para simplificar, calculamos al vuelo en _calculatePendingReward

        lastUpdateTime = block.timestamp;
    }

    function _calculatePendingReward(address user) internal view returns (uint256) {
        if (userStaked[user] == 0) return 0;

        uint256 timeElapsed = block.timestamp - lastUpdateTime;
        uint256 globalReward = rewardRatePerSecond * timeElapsed;
        uint256 userShare = (userStaked[user] * globalReward) / 1e18;

        return userShare + (userStaked[user] * rewardRatePerSecond * (block.timestamp - lastUpdateTime)) / 1e18;
        // Nota: Esta es una versión simplificada.
        // Para producción, usa un acumulador global como en SushiSwap o Compound.
    }

    function _payReward(address user, uint256 reward) internal {
        if (reward == 0) return;

        uint256 platformFee = (reward * platformCommissionBps) / 10_000;
        uint256 userNetReward = reward - platformFee;

        // Aprobar y transferir desde rewardWallet
        fmcToken.safeTransferFrom(rewardWallet, user, userNetReward);
        if (platformFee > 0) {
            fmcToken.safeTransferFrom(rewardWallet, platformWallet, platformFee);
        }

        userRewardDebt[user] = 0;
    }

    // Vista para el frontend
    function pendingReward(address user) external view returns (uint256) {
        return _calculatePendingReward(user);
    }
}
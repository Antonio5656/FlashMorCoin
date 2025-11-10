// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

contract FlashMorCoin is ERC20, Ownable, Pausable {
    address public minter;

    constructor() ERC20("FlashMor Coin", "FMC") {
        minter = msg.sender;
    }

    /**
     * @dev Only the minter (or owner) can mint new tokens.
     */
    function mint(address to, uint256 amount) external {
        require(msg.sender == minter || msg.sender == owner(), "Not authorized to mint");
        _mint(to, amount);
    }

    /**
     * @dev Allow owner to update the minter role.
     */
    function setMinter(address newMinter) external onlyOwner {
        require(newMinter != address(0), "Invalid address");
        minter = newMinter;
    }

    /**
     * @dev Pause/Unpause transfers (emergency use).
     */
    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal override whenNotPaused {
        super._beforeTokenTransfer(from, to, amount);
    }
}
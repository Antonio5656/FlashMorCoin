// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface IPriceFeed {
    function getTokenValue(address token, uint256 amount) external view returns (uint256);
}
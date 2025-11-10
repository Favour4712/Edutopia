// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/// @title MockUSDC
/// @notice Simple ERC20 token with faucet functionality for testing
contract MockUSDC is ERC20, Ownable {
    /// @notice Amount dispensed per faucet claim (1,000 USDC)
    uint256 public constant FAUCET_AMOUNT = 1_000_000_000;

    /// @notice Cooldown between faucet claims
    uint256 public immutable faucetCooldown;

    /// @notice Tracks last claim timestamp per address
    mapping(address => uint256) public lastClaimAt;

    event FaucetClaimed(address indexed recipient, uint256 amount);

    constructor(
        uint256 _faucetCooldown
    ) ERC20("Mock USDC", "mUSDC") Ownable(msg.sender) {
        faucetCooldown = _faucetCooldown;
    }

    /// @notice Mint tokens for testing purposes
    /// @param to Recipient address
    /// @param amount Amount of tokens to mint (6 decimal places)
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }

    /// @notice Claim faucet tokens, subject to cooldown
    function claimFaucet() external {
        uint256 lastClaim = lastClaimAt[msg.sender];
        if (lastClaim != 0 && block.timestamp < lastClaim + faucetCooldown) {
            revert("Faucet cooldown active");
        }

        lastClaimAt[msg.sender] = block.timestamp;
        _mint(msg.sender, FAUCET_AMOUNT);
        emit FaucetClaimed(msg.sender, FAUCET_AMOUNT);
    }

    /// @notice Override decimals to match USDC (6 decimals)
    function decimals() public pure override returns (uint8) {
        return 6;
    }
}

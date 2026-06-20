// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

interface IERC20Minimal {
    function balanceOf(address account) external view returns (uint256);
}

/**
 * @title CLAWDGate
 * @notice Read-only token gate: checks CLAWD balance against configurable tier thresholds.
 *         No funds are held. Owner (client) can adjust thresholds without redeployment.
 */
contract CLAWDGate is Ownable {
    IERC20Minimal public immutable clawdToken;

    // tier => minimum CLAWD balance (18 decimals)
    mapping(uint8 => uint256) public tierThresholds;

    // Reserved slot for future V2 registry integration
    address public registryAddress;

    event TierThresholdUpdated(uint8 indexed tier, uint256 newMinBalance);

    constructor(address _clawdToken, address _owner) Ownable(_owner) {
        clawdToken = IERC20Minimal(_clawdToken);
        // Tier 0 = free (threshold 0), Tier 1 = base gate (10M CLAWD)
        tierThresholds[0] = 0;
        tierThresholds[1] = 10_000_000 * 1e18;
    }

    /// @notice Returns the minimum balance for the base tier (tier 1).
    function minimumBalance() external view returns (uint256) {
        return tierThresholds[1];
    }

    /// @notice Returns true if wallet holds enough CLAWD for the requested tier.
    function hasAccess(address wallet, uint8 tier) external view returns (bool) {
        return clawdToken.balanceOf(wallet) >= tierThresholds[tier];
    }

    /// @notice Owner sets the minimum balance for a tier.
    function setTierThreshold(uint8 tier, uint256 minBalance) external onlyOwner {
        tierThresholds[tier] = minBalance;
        emit TierThresholdUpdated(tier, minBalance);
    }

    /// @notice Owner sets the registry address for future V2 integration.
    function setRegistry(address _registry) external onlyOwner {
        registryAddress = _registry;
    }
}

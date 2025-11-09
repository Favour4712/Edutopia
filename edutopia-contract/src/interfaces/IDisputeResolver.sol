// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {DisputeLib} from "../libraries/DisputeLib.sol";

/// @title IDisputeResolver
/// @notice Interface for dispute resolution
interface IDisputeResolver {
    /// @notice Raise a dispute for a session
    /// @param sessionId ID of the session to dispute
    /// @param reason Reason for the dispute
    /// @param evidence IPFS hash or evidence reference
    /// @return disputeId The ID of the created dispute
    function raiseDispute(
        uint256 sessionId,
        string calldata reason,
        string calldata evidence
    ) external returns (uint256 disputeId);
    
    /// @notice Resolve a dispute
    /// @param disputeId ID of the dispute
    /// @param outcome Outcome of the dispute
    function resolveDispute(
        uint256 disputeId,
        DisputeLib.DisputeOutcome outcome
    ) external;
    
    /// @notice Submit additional evidence for a dispute
    /// @param disputeId ID of the dispute
    /// @param evidence IPFS hash or evidence reference
    function submitEvidence(uint256 disputeId, string calldata evidence) external;
    
    /// @notice Get dispute details
    /// @param disputeId ID of the dispute
    /// @return Dispute struct
    function getDispute(uint256 disputeId) external view returns (DisputeLib.Dispute memory);
    
    /// @notice Get dispute ID for a session
    /// @param sessionId ID of the session
    /// @return uint256 Dispute ID (0 if no dispute)
    function getDisputeBySession(uint256 sessionId) external view returns (uint256);
    
    /// @notice Check if session has an active dispute
    /// @param sessionId ID of the session
    /// @return bool True if session has active dispute
    function hasActiveDispute(uint256 sessionId) external view returns (bool);
}


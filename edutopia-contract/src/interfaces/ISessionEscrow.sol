// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {SessionLib} from "../libraries/SessionLib.sol";

/// @title ISessionEscrow
/// @notice Interface for session escrow management
interface ISessionEscrow {
    /// @notice Create a new learning session
    /// @param tutor Address of the tutor
    /// @param duration Duration of the session in seconds
    /// @param subject Subject being taught
    /// @param description Session description
    /// @return sessionId The ID of the created session
    function createSession(address tutor, uint256 duration, string calldata subject, string calldata description)
        external
        returns (uint256 sessionId);

    /// @notice Create a new learning session for a specific student (called by hub)
    /// @param student Address of the student
    /// @param tutor Address of the tutor
    /// @param duration Duration of the session in seconds
    /// @param subject Subject being taught
    /// @param description Session description
    /// @return sessionId The ID of the created session
    function createSessionFor(
        address student,
        address tutor,
        uint256 duration,
        string calldata subject,
        string calldata description
    ) external returns (uint256 sessionId);

    /// @notice Complete a session
    /// @param sessionId ID of the session to complete
    function completeSession(uint256 sessionId) external;

    /// @notice Complete a session (called by hub)
    /// @param caller Address of the caller
    /// @param sessionId ID of the session to complete
    function completeSessionFor(address caller, uint256 sessionId) external;

    /// @notice Cancel a session before it starts
    /// @param sessionId ID of the session to cancel
    function cancelSession(uint256 sessionId) external;

    /// @notice Cancel a session (called by hub)
    /// @param caller Address of the caller
    /// @param sessionId ID of the session to cancel
    function cancelSessionFor(address caller, uint256 sessionId) external;

    /// @notice Release payment to tutor after dispute window
    /// @param sessionId ID of the session
    function releasePayment(uint256 sessionId) external;

    /// @notice Get session details
    /// @param sessionId ID of the session
    /// @return Session struct
    function getSession(uint256 sessionId) external view returns (SessionLib.Session memory);

    /// @notice Get session metadata
    /// @param sessionId ID of the session
    /// @return SessionMetadata struct
    function getSessionMetadata(uint256 sessionId) external view returns (SessionLib.SessionMetadata memory);

    /// @notice Get total number of sessions
    /// @return uint256 Total session count
    function getTotalSessions() external view returns (uint256);

    /// @notice Mark session as disputed
    /// @param sessionId ID of the session
    function markSessionDisputed(uint256 sessionId) external;

    /// @notice Process dispute resolution
    /// @param sessionId ID of the session
    /// @param refundToStudent Whether to refund the student
    /// @param refundAmount Amount to refund
    function resolveSessionDispute(uint256 sessionId, bool refundToStudent, uint256 refundAmount) external;
}


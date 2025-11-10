// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title SessionLib
/// @notice Library for session data structures and helper functions
library SessionLib {
    /// @notice Session status enum
    enum SessionStatus {
        Pending, // Session created, waiting to start
        Active, // Session is currently ongoing
        Completed, // Session finished successfully
        Disputed, // Session is under dispute
        Cancelled, // Session was cancelled
        Refunded // Session was refunded
    }

    /// @notice Core session data structure
    struct Session {
        uint256 id;
        address student;
        address tutor;
        uint256 amount;
        uint256 startTime;
        uint256 duration; // in seconds
        SessionStatus status;
        uint256 completedAt;
        bool paymentReleased;
        bool hasDispute;
    }

    /// @notice Session metadata structure
    struct SessionMetadata {
        string subject;
        string description;
        string[] learningObjectives;
    }

    /// @notice Check if session is currently active
    /// @param session The session to check
    /// @return bool True if session is active and within time window
    function isActive(Session memory session) internal view returns (bool) {
        return session.status == SessionStatus.Active && block.timestamp >= session.startTime
            && block.timestamp <= session.startTime + session.duration;
    }

    /// @notice Check if session can be completed
    /// @param session The session to check
    /// @return bool True if session can be marked as completed
    function canComplete(Session memory session) internal view returns (bool) {
        return session.status == SessionStatus.Active && block.timestamp >= session.startTime + session.duration;
    }

    /// @notice Check if session can be disputed
    /// @param session The session to check
    /// @param disputeWindow The dispute window duration in seconds
    /// @return bool True if session is within dispute window
    function canDispute(Session memory session, uint256 disputeWindow) internal view returns (bool) {
        return session.status == SessionStatus.Completed && !session.hasDispute
            && block.timestamp <= session.completedAt + disputeWindow;
    }

    /// @notice Check if session can be cancelled
    /// @param session The session to check
    /// @return bool True if session can be cancelled
    function canCancel(Session memory session) internal view returns (bool) {
        return session.status == SessionStatus.Pending
            || (session.status == SessionStatus.Active && block.timestamp < session.startTime);
    }

    /// @notice Check if payment can be released
    /// @param session The session to check
    /// @param disputeWindow The dispute window duration in seconds
    /// @return bool True if payment can be released to tutor
    function canReleasePayment(Session memory session, uint256 disputeWindow) internal view returns (bool) {
        return session.status == SessionStatus.Completed && !session.paymentReleased && !session.hasDispute
            && block.timestamp > session.completedAt + disputeWindow;
    }
}

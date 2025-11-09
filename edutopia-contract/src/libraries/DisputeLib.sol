// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title DisputeLib
/// @notice Library for dispute data structures
library DisputeLib {
    /// @notice Dispute status enum
    enum DisputeStatus {
        Open, // Dispute has been raised
        UnderReview, // Dispute is being reviewed by arbiters
        Resolved // Dispute has been resolved
    }

    /// @notice Dispute outcome enum
    enum DisputeOutcome {
        Pending, // No decision yet
        RefundStudent, // Full refund to student
        PayTutor, // Full payment to tutor
        Split // Split payment between parties
    }

    /// @notice Core dispute data structure
    struct Dispute {
        uint256 id;
        uint256 sessionId;
        address raisedBy;
        string reason;
        string evidence; // IPFS hash or other reference
        DisputeStatus status;
        DisputeOutcome outcome;
        uint256 createdAt;
        uint256 resolvedAt;
        address resolvedBy;
        uint256 refundAmount;
    }

    /// @notice Check if dispute can be resolved
    /// @param dispute The dispute to check
    /// @return bool True if dispute is open or under review
    function canResolve(Dispute memory dispute) internal pure returns (bool) {
        return
            dispute.status == DisputeStatus.Open ||
            dispute.status == DisputeStatus.UnderReview;
    }

    /// @notice Check if dispute is resolved
    /// @param dispute The dispute to check
    /// @return bool True if dispute has been resolved
    function isResolved(Dispute memory dispute) internal pure returns (bool) {
        return dispute.status == DisputeStatus.Resolved;
    }
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title Events
/// @notice Centralized event definitions for the Peer Learning Marketplace
library Events {
    // ============ Session Events ============
    event SessionCreated(
        uint256 indexed sessionId,
        address indexed student,
        address indexed tutor,
        uint256 amount,
        uint256 startTime,
        uint256 duration
    );

    event SessionCompleted(
        uint256 indexed sessionId, address indexed student, address indexed tutor, uint256 completedAt
    );

    event SessionCancelled(uint256 indexed sessionId, address indexed cancelledBy, uint256 refundAmount, string reason);

    event PaymentReleased(uint256 indexed sessionId, address indexed tutor, uint256 amount, uint256 platformFee);

    // ============ Dispute Events ============
    event DisputeRaised(uint256 indexed disputeId, uint256 indexed sessionId, address indexed raisedBy, string reason);

    event DisputeResolved(
        uint256 indexed disputeId,
        uint256 indexed sessionId,
        address indexed resolvedBy,
        bool refundToStudent,
        uint256 refundAmount
    );

    event DisputeEvidenceSubmitted(uint256 indexed disputeId, address indexed submittedBy, string evidenceHash);

    // ============ Tutor Events ============
    event TutorRegistered(address indexed tutor, string[] subjects, uint256 hourlyRate);

    event TutorProfileUpdated(address indexed tutor, uint256 newHourlyRate);

    event TutorRated(address indexed tutor, address indexed ratedBy, uint256 indexed sessionId, uint256 rating);

    // ============ Certificate Events ============
    event CertificateMinted(
        uint256 indexed tokenId, address indexed student, uint256 indexed sessionId, string subject, string metadataURI
    );

    // ============ Platform Events ============
    event PlatformFeeUpdated(uint256 oldFee, uint256 newFee);

    event DisputeWindowUpdated(uint256 oldWindow, uint256 newWindow);

    event PlatformFeesWithdrawn(address indexed recipient, uint256 amount);

    event EmergencyPaused(address indexed pausedBy, uint256 timestamp);

    event EmergencyUnpaused(address indexed unpausedBy, uint256 timestamp);
}


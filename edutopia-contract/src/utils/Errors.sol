// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title Errors
/// @notice Centralized error handling for the Peer Learning Marketplace
library Errors {
    // ============ Session Escrow Errors ============
    error InsufficientPayment();
    error SessionNotFound();
    error SessionAlreadyCompleted();
    error SessionAlreadyCancelled();
    error UnauthorizedAccess();
    error InvalidSessionState();
    error DisputePeriodNotEnded();
    error DisputeWindowExpired();
    error SessionNotStarted();
    error SessionStillActive();
    error PaymentAlreadyReleased();
    error CannotCancelActiveSession();

    // ============ Tutor Registry Errors ============
    error TutorNotRegistered();
    error TutorAlreadyRegistered();
    error InvalidRating();
    error InvalidHourlyRate();
    error EmptySubjects();
    error CannotRateSelf();
    error AlreadyRatedThisSession();

    // ============ Dispute Resolver Errors ============
    error DisputeNotFound();
    error DisputeAlreadyResolved();
    error InvalidDisputeEvidence();
    error NotArbiter();
    error CannotDisputeOwnSession();
    error DisputeWindowClosed();
    error SessionNotCompleted();
    error DisputeAlreadyExists();

    // ============ Certificate NFT Errors ============
    error CertificateAlreadyMinted();
    error InvalidMetadata();
    error OnlyStudentCanMint();

    // ============ General Errors ============
    error ZeroAddress();
    error InvalidAmount();
    error ContractPaused();
    error InvalidDuration();
    error PlatformFeeExceedsMax();
}

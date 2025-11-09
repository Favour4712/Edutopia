// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {IDisputeResolver} from "../interfaces/IDisputeResolver.sol";
import {ISessionEscrow} from "../interfaces/ISessionEscrow.sol";
import {DisputeLib} from "../libraries/DisputeLib.sol";
import {SessionLib} from "../libraries/SessionLib.sol";
import {Errors} from "../utils/Errors.sol";
import {Events} from "../utils/Events.sol";

/// @title DisputeResolver
/// @notice Manages dispute creation and resolution for sessions
contract DisputeResolver is IDisputeResolver {
    using DisputeLib for DisputeLib.Dispute;
    
    // ============ State Variables ============
    
    /// @notice Session escrow contract
    ISessionEscrow public sessionEscrow;
    
    /// @notice Platform owner (can act as arbiter)
    address public platformOwner;
    
    /// @notice Mapping of arbiter addresses
    mapping(address => bool) public arbiters;
    
    /// @notice Mapping of dispute ID to dispute data
    mapping(uint256 => DisputeLib.Dispute) private disputes;
    
    /// @notice Mapping of session ID to dispute ID
    mapping(uint256 => uint256) private sessionDisputes;
    
    /// @notice Total number of disputes
    uint256 private disputeCounter;
    
    /// @notice Dispute window from session escrow
    uint256 public disputeWindow;
    
    // ============ Modifiers ============
    
    modifier onlyArbiter() {
        if (!arbiters[msg.sender] && msg.sender != platformOwner) {
            revert Errors.NotArbiter();
        }
        _;
    }
    
    modifier onlyPlatformOwner() {
        if (msg.sender != platformOwner) {
            revert Errors.UnauthorizedAccess();
        }
        _;
    }
    
    // ============ Constructor ============
    
    constructor(address _sessionEscrow, uint256 _disputeWindow) {
        if (_sessionEscrow == address(0)) {
            revert Errors.ZeroAddress();
        }
        
        sessionEscrow = ISessionEscrow(_sessionEscrow);
        platformOwner = msg.sender;
        disputeWindow = _disputeWindow;
        
        // Platform owner is default arbiter
        arbiters[msg.sender] = true;
    }
    
    // ============ External Functions ============
    
    /// @inheritdoc IDisputeResolver
    function raiseDispute(
        uint256 sessionId,
        string calldata reason,
        string calldata evidence
    ) external override returns (uint256 disputeId) {
        SessionLib.Session memory session = sessionEscrow.getSession(sessionId);
        
        // Validations
        if (session.id == 0) {
            revert Errors.SessionNotFound();
        }
        if (msg.sender != session.student && msg.sender != session.tutor) {
            revert Errors.UnauthorizedAccess();
        }
        if (session.status != SessionLib.SessionStatus.Completed) {
            revert Errors.SessionNotCompleted();
        }
        if (session.hasDispute) {
            revert Errors.DisputeAlreadyExists();
        }
        if (block.timestamp > session.completedAt + disputeWindow) {
            revert Errors.DisputeWindowClosed();
        }
        if (bytes(reason).length == 0) {
            revert Errors.InvalidDisputeEvidence();
        }
        
        // Check if dispute already exists for this session
        if (sessionDisputes[sessionId] != 0) {
            revert Errors.DisputeAlreadyExists();
        }
        
        // Create dispute
        disputeCounter++;
        disputeId = disputeCounter;
        
        disputes[disputeId] = DisputeLib.Dispute({
            id: disputeId,
            sessionId: sessionId,
            raisedBy: msg.sender,
            reason: reason,
            evidence: evidence,
            status: DisputeLib.DisputeStatus.Open,
            outcome: DisputeLib.DisputeOutcome.Pending,
            createdAt: block.timestamp,
            resolvedAt: 0,
            resolvedBy: address(0),
            refundAmount: 0
        });
        
        sessionDisputes[sessionId] = disputeId;
        
        // Mark session as disputed
        sessionEscrow.markSessionDisputed(sessionId);
        
        emit Events.DisputeRaised(disputeId, sessionId, msg.sender, reason);
        
        return disputeId;
    }
    
    /// @inheritdoc IDisputeResolver
    function resolveDispute(
        uint256 disputeId,
        DisputeLib.DisputeOutcome outcome
    ) external override onlyArbiter {
        DisputeLib.Dispute storage dispute = disputes[disputeId];
        
        if (dispute.id == 0) {
            revert Errors.DisputeNotFound();
        }
        if (!dispute.canResolve()) {
            revert Errors.DisputeAlreadyResolved();
        }
        if (outcome == DisputeLib.DisputeOutcome.Pending) {
            revert Errors.InvalidDisputeEvidence();
        }
        
        SessionLib.Session memory session = sessionEscrow.getSession(dispute.sessionId);
        
        dispute.status = DisputeLib.DisputeStatus.Resolved;
        dispute.outcome = outcome;
        dispute.resolvedAt = block.timestamp;
        dispute.resolvedBy = msg.sender;
        
        bool refundToStudent = false;
        uint256 refundAmount = 0;
        
        if (outcome == DisputeLib.DisputeOutcome.RefundStudent) {
            // Full refund to student
            refundToStudent = true;
            refundAmount = session.amount;
        } else if (outcome == DisputeLib.DisputeOutcome.PayTutor) {
            // Full payment to tutor (handled by escrow)
            refundToStudent = false;
            refundAmount = 0;
        } else if (outcome == DisputeLib.DisputeOutcome.Split) {
            // Split 50/50
            refundToStudent = true;
            refundAmount = session.amount / 2;
        }
        
        dispute.refundAmount = refundAmount;
        
        // Resolve in escrow contract
        sessionEscrow.resolveSessionDispute(dispute.sessionId, refundToStudent, refundAmount);
        
        emit Events.DisputeResolved(
            disputeId,
            dispute.sessionId,
            msg.sender,
            refundToStudent,
            refundAmount
        );
    }
    
    /// @inheritdoc IDisputeResolver
    function submitEvidence(uint256 disputeId, string calldata evidence) external override {
        DisputeLib.Dispute storage dispute = disputes[disputeId];
        
        if (dispute.id == 0) {
            revert Errors.DisputeNotFound();
        }
        if (dispute.isResolved()) {
            revert Errors.DisputeAlreadyResolved();
        }
        
        SessionLib.Session memory session = sessionEscrow.getSession(dispute.sessionId);
        
        if (msg.sender != session.student && msg.sender != session.tutor) {
            revert Errors.UnauthorizedAccess();
        }
        
        // Update dispute status to under review
        if (dispute.status == DisputeLib.DisputeStatus.Open) {
            dispute.status = DisputeLib.DisputeStatus.UnderReview;
        }
        
        emit Events.DisputeEvidenceSubmitted(disputeId, msg.sender, evidence);
    }
    
    // ============ Admin Functions ============
    
    /// @notice Add an arbiter
    /// @param arbiter Address to add as arbiter
    function addArbiter(address arbiter) external onlyPlatformOwner {
        if (arbiter == address(0)) {
            revert Errors.ZeroAddress();
        }
        arbiters[arbiter] = true;
    }
    
    /// @notice Remove an arbiter
    /// @param arbiter Address to remove as arbiter
    function removeArbiter(address arbiter) external onlyPlatformOwner {
        arbiters[arbiter] = false;
    }
    
    /// @notice Update dispute window
    /// @param newWindow New dispute window in seconds
    function updateDisputeWindow(uint256 newWindow) external onlyPlatformOwner {
        disputeWindow = newWindow;
    }
    
    // ============ View Functions ============
    
    /// @inheritdoc IDisputeResolver
    function getDispute(uint256 disputeId) external view override returns (DisputeLib.Dispute memory) {
        return disputes[disputeId];
    }
    
    /// @inheritdoc IDisputeResolver
    function getDisputeBySession(uint256 sessionId) external view override returns (uint256) {
        return sessionDisputes[sessionId];
    }
    
    /// @inheritdoc IDisputeResolver
    function hasActiveDispute(uint256 sessionId) external view override returns (bool) {
        uint256 disputeId = sessionDisputes[sessionId];
        if (disputeId == 0) {
            return false;
        }
        
        DisputeLib.Dispute memory dispute = disputes[disputeId];
        return !dispute.isResolved();
    }
    
    /// @notice Get total number of disputes
    /// @return uint256 Total dispute count
    function getTotalDisputes() external view returns (uint256) {
        return disputeCounter;
    }
    
    /// @notice Check if address is an arbiter
    /// @param account Address to check
    /// @return bool True if account is an arbiter
    function isArbiter(address account) external view returns (bool) {
        return arbiters[account] || account == platformOwner;
    }
}


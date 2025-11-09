// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ISessionEscrow} from "../interfaces/ISessionEscrow.sol";
import {ITutorRegistry} from "../interfaces/ITutorRegistry.sol";
import {SessionLib} from "../libraries/SessionLib.sol";
import {Errors} from "../utils/Errors.sol";
import {Events} from "../utils/Events.sol";

/// @title SessionEscrow
/// @notice Manages session creation, escrow, and payment release
contract SessionEscrow is ISessionEscrow {
    using SessionLib for SessionLib.Session;

    // ============ State Variables ============

    /// @notice Tutor registry contract
    ITutorRegistry public tutorRegistry;

    /// @notice Dispute resolver contract address
    address public disputeResolver;

    /// @notice Platform owner address
    address public platformOwner;

    /// @notice Mapping of session ID to session data
    mapping(uint256 => SessionLib.Session) private sessions;

    /// @notice Mapping of session ID to session metadata
    mapping(uint256 => SessionLib.SessionMetadata) private sessionMetadata;

    /// @notice Total number of sessions created
    uint256 private sessionCounter;

    /// @notice Dispute window duration (48 hours)
    uint256 public disputeWindow = 48 hours;

    /// @notice Platform fee percentage (basis points, 250 = 2.5%)
    uint256 public platformFee = 250;

    /// @notice Maximum platform fee (10%)
    uint256 public constant MAX_PLATFORM_FEE = 1000;

    /// @notice Accumulated platform fees
    uint256 public accumulatedFees;

    /// @notice Minimum session duration (30 minutes)
    uint256 public constant MIN_SESSION_DURATION = 30 minutes;

    /// @notice Maximum session duration (8 hours)
    uint256 public constant MAX_SESSION_DURATION = 8 hours;

    /// @notice Contract paused state
    bool public paused;

    // ============ Modifiers ============

    modifier whenNotPaused() {
        if (paused) {
            revert Errors.ContractPaused();
        }
        _;
    }

    modifier onlyPlatformOwner() {
        if (msg.sender != platformOwner) {
            revert Errors.UnauthorizedAccess();
        }
        _;
    }

    modifier onlyDisputeResolver() {
        if (msg.sender != disputeResolver) {
            revert Errors.UnauthorizedAccess();
        }
        _;
    }

    // ============ Constructor ============

    constructor(address _tutorRegistry) {
        if (_tutorRegistry == address(0)) {
            revert Errors.ZeroAddress();
        }

        tutorRegistry = ITutorRegistry(_tutorRegistry);
        platformOwner = msg.sender;
    }

    // ============ External Functions ============

    /// @inheritdoc ISessionEscrow
    function createSession(
        address tutor,
        uint256 duration,
        string calldata subject,
        string calldata description
    ) external payable override whenNotPaused returns (uint256 sessionId) {
        // Validations
        if (tutor == address(0)) {
            revert Errors.ZeroAddress();
        }
        if (tutor == msg.sender) {
            revert Errors.UnauthorizedAccess();
        }
        if (!tutorRegistry.isTutorRegistered(tutor)) {
            revert Errors.TutorNotRegistered();
        }
        if (
            duration < MIN_SESSION_DURATION || duration > MAX_SESSION_DURATION
        ) {
            revert Errors.InvalidDuration();
        }
        if (msg.value == 0) {
            revert Errors.InsufficientPayment();
        }

        // Get tutor's hourly rate
        ITutorRegistry.TutorProfile memory tutorProfile = tutorRegistry
            .getTutorProfile(tutor);
        uint256 expectedPayment = (tutorProfile.hourlyRate * duration) /
            1 hours;

        if (msg.value < expectedPayment) {
            revert Errors.InsufficientPayment();
        }

        // Create session
        sessionCounter++;
        sessionId = sessionCounter;

        sessions[sessionId] = SessionLib.Session({
            id: sessionId,
            student: msg.sender,
            tutor: tutor,
            amount: msg.value,
            startTime: block.timestamp,
            duration: duration,
            status: SessionLib.SessionStatus.Active,
            completedAt: 0,
            paymentReleased: false,
            hasDispute: false
        });

        sessionMetadata[sessionId] = SessionLib.SessionMetadata({
            subject: subject,
            description: description,
            learningObjectives: new string[](0)
        });

        emit Events.SessionCreated(
            sessionId,
            msg.sender,
            tutor,
            msg.value,
            block.timestamp,
            duration
        );

        return sessionId;
    }

    /// @inheritdoc ISessionEscrow
    function completeSession(
        uint256 sessionId
    ) external override whenNotPaused {
        SessionLib.Session storage session = sessions[sessionId];

        if (session.id == 0) {
            revert Errors.SessionNotFound();
        }
        if (msg.sender != session.tutor && msg.sender != session.student) {
            revert Errors.UnauthorizedAccess();
        }
        if (session.status != SessionLib.SessionStatus.Active) {
            revert Errors.InvalidSessionState();
        }
        if (block.timestamp < session.startTime + session.duration) {
            revert Errors.SessionStillActive();
        }

        session.status = SessionLib.SessionStatus.Completed;
        session.completedAt = block.timestamp;

        // Increment tutor's session count
        tutorRegistry.incrementSessionCount(session.tutor);

        emit Events.SessionCompleted(
            sessionId,
            session.student,
            session.tutor,
            block.timestamp
        );
    }

    /// @inheritdoc ISessionEscrow
    function cancelSession(uint256 sessionId) external override whenNotPaused {
        SessionLib.Session storage session = sessions[sessionId];

        if (session.id == 0) {
            revert Errors.SessionNotFound();
        }
        if (msg.sender != session.student && msg.sender != session.tutor) {
            revert Errors.UnauthorizedAccess();
        }
        if (!session.canCancel()) {
            revert Errors.CannotCancelActiveSession();
        }

        session.status = SessionLib.SessionStatus.Cancelled;

        // Refund the student
        uint256 refundAmount = session.amount;
        session.amount = 0;

        (bool success, ) = payable(session.student).call{value: refundAmount}(
            ""
        );
        require(success, "Refund failed");

        emit Events.SessionCancelled(
            sessionId,
            msg.sender,
            refundAmount,
            "Session cancelled before start"
        );
    }

    /// @inheritdoc ISessionEscrow
    function releasePayment(uint256 sessionId) external override whenNotPaused {
        SessionLib.Session storage session = sessions[sessionId];

        if (session.id == 0) {
            revert Errors.SessionNotFound();
        }
        if (session.paymentReleased) {
            revert Errors.PaymentAlreadyReleased();
        }
        if (!session.canReleasePayment(disputeWindow)) {
            revert Errors.DisputePeriodNotEnded();
        }

        session.paymentReleased = true;

        // Calculate platform fee
        uint256 fee = (session.amount * platformFee) / 10000;
        uint256 tutorPayment = session.amount - fee;

        accumulatedFees += fee;

        // Transfer payment to tutor
        (bool success, ) = payable(session.tutor).call{value: tutorPayment}("");
        require(success, "Payment transfer failed");

        emit Events.PaymentReleased(
            sessionId,
            session.tutor,
            tutorPayment,
            fee
        );
    }

    /// @inheritdoc ISessionEscrow
    function markSessionDisputed(
        uint256 sessionId
    ) external override onlyDisputeResolver {
        SessionLib.Session storage session = sessions[sessionId];

        if (session.id == 0) {
            revert Errors.SessionNotFound();
        }

        session.status = SessionLib.SessionStatus.Disputed;
        session.hasDispute = true;
    }

    /// @inheritdoc ISessionEscrow
    function resolveSessionDispute(
        uint256 sessionId,
        bool refundToStudent,
        uint256 refundAmount
    ) external override onlyDisputeResolver {
        SessionLib.Session storage session = sessions[sessionId];

        if (session.id == 0) {
            revert Errors.SessionNotFound();
        }
        if (session.paymentReleased) {
            revert Errors.PaymentAlreadyReleased();
        }

        session.paymentReleased = true;
        session.status = SessionLib.SessionStatus.Refunded;

        if (refundToStudent) {
            // Refund to student
            (bool success, ) = payable(session.student).call{
                value: refundAmount
            }("");
            require(success, "Refund failed");

            // Pay remaining to tutor if split
            if (refundAmount < session.amount) {
                uint256 tutorAmount = session.amount - refundAmount;
                (success, ) = payable(session.tutor).call{value: tutorAmount}(
                    ""
                );
                require(success, "Tutor payment failed");
            }
        } else {
            // Pay to tutor
            uint256 fee = (session.amount * platformFee) / 10000;
            uint256 tutorPayment = session.amount - fee;

            accumulatedFees += fee;

            (bool success, ) = payable(session.tutor).call{value: tutorPayment}(
                ""
            );
            require(success, "Tutor payment failed");
        }
    }

    // ============ Admin Functions ============

    /// @notice Set dispute resolver contract
    /// @param _disputeResolver Address of dispute resolver
    function setDisputeResolver(
        address _disputeResolver
    ) external onlyPlatformOwner {
        if (_disputeResolver == address(0)) {
            revert Errors.ZeroAddress();
        }
        disputeResolver = _disputeResolver;
    }

    /// @notice Update dispute window
    /// @param newWindow New dispute window in seconds
    function updateDisputeWindow(uint256 newWindow) external onlyPlatformOwner {
        uint256 oldWindow = disputeWindow;
        disputeWindow = newWindow;
        emit Events.DisputeWindowUpdated(oldWindow, newWindow);
    }

    /// @notice Update platform fee
    /// @param newFee New platform fee in basis points
    function updatePlatformFee(uint256 newFee) external onlyPlatformOwner {
        if (newFee > MAX_PLATFORM_FEE) {
            revert Errors.PlatformFeeExceedsMax();
        }
        uint256 oldFee = platformFee;
        platformFee = newFee;
        emit Events.PlatformFeeUpdated(oldFee, newFee);
    }

    /// @notice Withdraw accumulated platform fees
    function withdrawFees() external onlyPlatformOwner {
        uint256 amount = accumulatedFees;
        accumulatedFees = 0;

        (bool success, ) = payable(platformOwner).call{value: amount}("");
        require(success, "Fee withdrawal failed");

        emit Events.PlatformFeesWithdrawn(platformOwner, amount);
    }

    /// @notice Pause contract
    function pause() external onlyPlatformOwner {
        paused = true;
        emit Events.EmergencyPaused(msg.sender, block.timestamp);
    }

    /// @notice Unpause contract
    function unpause() external onlyPlatformOwner {
        paused = false;
        emit Events.EmergencyUnpaused(msg.sender, block.timestamp);
    }

    // ============ View Functions ============

    /// @inheritdoc ISessionEscrow
    function getSession(
        uint256 sessionId
    ) external view override returns (SessionLib.Session memory) {
        return sessions[sessionId];
    }

    /// @inheritdoc ISessionEscrow
    function getSessionMetadata(
        uint256 sessionId
    ) external view override returns (SessionLib.SessionMetadata memory) {
        return sessionMetadata[sessionId];
    }

    /// @inheritdoc ISessionEscrow
    function getTotalSessions() external view override returns (uint256) {
        return sessionCounter;
    }
}

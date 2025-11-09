// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ITutorRegistry} from "../interfaces/ITutorRegistry.sol";
import {Errors} from "../utils/Errors.sol";
import {Events} from "../utils/Events.sol";

/// @title TutorRegistry
/// @notice Manages tutor registration, profiles, and ratings
contract TutorRegistry is ITutorRegistry {
    // ============ State Variables ============

    /// @notice Mapping of tutor address to their profile
    mapping(address => TutorProfile) private tutorProfiles;

    /// @notice Mapping to track which students have rated which tutors for which sessions
    mapping(address => mapping(uint256 => bool)) private sessionRatings;

    /// @notice Address authorized to increment session counts (SessionEscrow contract)
    address public sessionEscrow;

    /// @notice Minimum hourly rate (0.001 ETH)
    uint256 public constant MIN_HOURLY_RATE = 0.001 ether;

    /// @notice Maximum hourly rate (10 ETH)
    uint256 public constant MAX_HOURLY_RATE = 10 ether;

    /// @notice Minimum rating value
    uint256 public constant MIN_RATING = 1;

    /// @notice Maximum rating value
    uint256 public constant MAX_RATING = 5;

    // ============ Modifiers ============

    /// @notice Only registered tutors can call
    modifier onlyRegisteredTutor() {
        if (!tutorProfiles[msg.sender].isRegistered) {
            revert Errors.TutorNotRegistered();
        }
        _;
    }

    /// @notice Only session escrow contract can call
    modifier onlySessionEscrow() {
        if (msg.sender != sessionEscrow) {
            revert Errors.UnauthorizedAccess();
        }
        _;
    }

    // ============ Constructor ============

    constructor() {
        // Session escrow will be set by the hub contract
    }

    // ============ External Functions ============

    /// @inheritdoc ITutorRegistry
    function registerTutor(
        string[] calldata subjects,
        uint256 hourlyRate
    ) external override {
        if (tutorProfiles[msg.sender].isRegistered) {
            revert Errors.TutorAlreadyRegistered();
        }
        if (subjects.length == 0) {
            revert Errors.EmptySubjects();
        }
        if (hourlyRate < MIN_HOURLY_RATE || hourlyRate > MAX_HOURLY_RATE) {
            revert Errors.InvalidHourlyRate();
        }

        tutorProfiles[msg.sender] = TutorProfile({
            isRegistered: true,
            subjects: subjects,
            hourlyRate: hourlyRate,
            totalSessions: 0,
            totalRating: 0,
            ratingCount: 0,
            registeredAt: block.timestamp
        });

        emit Events.TutorRegistered(msg.sender, subjects, hourlyRate);
    }

    /// @inheritdoc ITutorRegistry
    function updateHourlyRate(
        uint256 newRate
    ) external override onlyRegisteredTutor {
        if (newRate < MIN_HOURLY_RATE || newRate > MAX_HOURLY_RATE) {
            revert Errors.InvalidHourlyRate();
        }

        tutorProfiles[msg.sender].hourlyRate = newRate;

        emit Events.TutorProfileUpdated(msg.sender, newRate);
    }

    /// @inheritdoc ITutorRegistry
    function rateTutor(
        address tutor,
        uint256 sessionId,
        uint256 rating
    ) external override {
        if (!tutorProfiles[tutor].isRegistered) {
            revert Errors.TutorNotRegistered();
        }
        if (tutor == msg.sender) {
            revert Errors.CannotRateSelf();
        }
        if (rating < MIN_RATING || rating > MAX_RATING) {
            revert Errors.InvalidRating();
        }
        if (sessionRatings[msg.sender][sessionId]) {
            revert Errors.AlreadyRatedThisSession();
        }

        // Mark this session as rated by this student
        sessionRatings[msg.sender][sessionId] = true;

        // Update tutor's rating
        tutorProfiles[tutor].totalRating += rating;
        tutorProfiles[tutor].ratingCount += 1;

        emit Events.TutorRated(tutor, msg.sender, sessionId, rating);
    }

    /// @inheritdoc ITutorRegistry
    function incrementSessionCount(
        address tutor
    ) external override onlySessionEscrow {
        if (!tutorProfiles[tutor].isRegistered) {
            revert Errors.TutorNotRegistered();
        }

        tutorProfiles[tutor].totalSessions += 1;
    }

    /// @notice Set the session escrow contract address (called by hub)
    /// @param _sessionEscrow Address of the session escrow contract
    function setSessionEscrow(address _sessionEscrow) external {
        if (_sessionEscrow == address(0)) {
            revert Errors.ZeroAddress();
        }
        if (sessionEscrow != address(0)) {
            revert Errors.UnauthorizedAccess();
        }

        sessionEscrow = _sessionEscrow;
    }

    // ============ View Functions ============

    /// @inheritdoc ITutorRegistry
    function getTutorProfile(
        address tutor
    ) external view override returns (TutorProfile memory) {
        return tutorProfiles[tutor];
    }

    /// @inheritdoc ITutorRegistry
    function isTutorRegistered(
        address tutor
    ) external view override returns (bool) {
        return tutorProfiles[tutor].isRegistered;
    }

    /// @inheritdoc ITutorRegistry
    function getTutorRating(
        address tutor
    ) external view override returns (uint256) {
        if (tutorProfiles[tutor].ratingCount == 0) {
            return 0;
        }
        // Return average rating scaled by 100 (e.g., 450 = 4.50 stars)
        return
            (tutorProfiles[tutor].totalRating * 100) /
            tutorProfiles[tutor].ratingCount;
    }
}

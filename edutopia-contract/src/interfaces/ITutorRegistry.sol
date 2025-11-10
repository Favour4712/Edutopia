// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title ITutorRegistry
/// @notice Interface for tutor registration and profile management
interface ITutorRegistry {
    /// @notice Tutor profile structure
    struct TutorProfile {
        bool isRegistered;
        string[] subjects;
        uint256 hourlyRate;
        uint256 totalSessions;
        uint256 totalRating;
        uint256 ratingCount;
        uint256 registeredAt;
    }

    /// @notice Register as a tutor
    /// @param subjects Array of subjects the tutor can teach
    /// @param hourlyRate Hourly rate in wei
    function registerTutor(string[] calldata subjects, uint256 hourlyRate) external;

    /// @notice Register a tutor (called by hub)
    /// @param tutor Address of the tutor
    /// @param subjects Array of subjects the tutor can teach
    /// @param hourlyRate Hourly rate in wei
    function registerTutorFor(address tutor, string[] calldata subjects, uint256 hourlyRate) external;

    /// @notice Update tutor's hourly rate
    /// @param newRate New hourly rate in wei
    function updateHourlyRate(uint256 newRate) external;

    /// @notice Get tutor profile
    /// @param tutor Address of the tutor
    /// @return TutorProfile struct
    function getTutorProfile(address tutor) external view returns (TutorProfile memory);

    /// @notice Rate a tutor after a session
    /// @param tutor Address of the tutor
    /// @param sessionId ID of the completed session
    /// @param rating Rating from 1-5
    function rateTutor(address tutor, uint256 sessionId, uint256 rating) external;

    /// @notice Check if address is a registered tutor
    /// @param tutor Address to check
    /// @return bool True if tutor is registered
    function isTutorRegistered(address tutor) external view returns (bool);

    /// @notice Increment tutor's session count
    /// @param tutor Address of the tutor
    function incrementSessionCount(address tutor) external;

    /// @notice Get tutor's average rating
    /// @param tutor Address of the tutor
    /// @return uint256 Average rating (scaled by 100)
    function getTutorRating(address tutor) external view returns (uint256);
}


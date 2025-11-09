// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {TutorRegistry} from "./core/TutorRegistry.sol";
import {SessionEscrow} from "./core/SessionEscrow.sol";
import {DisputeResolver} from "./core/DisputeResolver.sol";
import {CertificateNFT} from "./tokens/CertificateNFT.sol";
import {ITutorRegistry} from "./interfaces/ITutorRegistry.sol";
import {ISessionEscrow} from "./interfaces/ISessionEscrow.sol";
import {IDisputeResolver} from "./interfaces/IDisputeResolver.sol";
import {ICertificateNFT} from "./interfaces/ICertificateNFT.sol";
import {SessionLib} from "./libraries/SessionLib.sol";
import {DisputeLib} from "./libraries/DisputeLib.sol";
import {Errors} from "./utils/Errors.sol";

/// @title PeerLearningHub
/// @notice Main entry point and orchestrator for the Peer Learning Marketplace
/// @dev Coordinates all core contracts and provides unified interface
contract PeerLearningHub {
    // ============ State Variables ============
    
    /// @notice Tutor registry contract
    TutorRegistry public immutable tutorRegistry;
    
    /// @notice Session escrow contract
    SessionEscrow public immutable sessionEscrow;
    
    /// @notice Dispute resolver contract
    DisputeResolver public immutable disputeResolver;
    
    /// @notice Certificate NFT contract
    CertificateNFT public immutable certificateNFT;
    
    /// @notice Platform owner
    address public immutable owner;
    
    /// @notice Contract version
    string public constant VERSION = "1.0.0";
    
    // ============ Events ============
    
    event HubDeployed(
        address indexed owner,
        address tutorRegistry,
        address sessionEscrow,
        address disputeResolver,
        address certificateNFT
    );
    
    // ============ Constructor ============
    
    /// @notice Deploy all contracts and wire them together
    constructor() {
        owner = msg.sender;
        
        // Deploy contracts in dependency order
        tutorRegistry = new TutorRegistry();
        sessionEscrow = new SessionEscrow(address(tutorRegistry));
        disputeResolver = new DisputeResolver(address(sessionEscrow), 48 hours);
        certificateNFT = new CertificateNFT(address(sessionEscrow));
        
        // Wire contracts together
        tutorRegistry.setSessionEscrow(address(sessionEscrow));
        sessionEscrow.setDisputeResolver(address(disputeResolver));
        
        emit HubDeployed(
            msg.sender,
            address(tutorRegistry),
            address(sessionEscrow),
            address(disputeResolver),
            address(certificateNFT)
        );
    }
    
    // ============ Tutor Functions ============
    
    /// @notice Register as a tutor
    /// @param subjects Array of subjects to teach
    /// @param hourlyRate Hourly rate in wei
    function registerAsTutor(string[] calldata subjects, uint256 hourlyRate) external {
        tutorRegistry.registerTutor(subjects, hourlyRate);
    }
    
    /// @notice Update tutor hourly rate
    /// @param newRate New hourly rate in wei
    function updateTutorRate(uint256 newRate) external {
        tutorRegistry.updateHourlyRate(newRate);
    }
    
    /// @notice Get tutor profile
    /// @param tutor Tutor address
    /// @return ITutorRegistry.TutorProfile Tutor profile data
    function getTutorProfile(address tutor) external view returns (ITutorRegistry.TutorProfile memory) {
        return tutorRegistry.getTutorProfile(tutor);
    }
    
    /// @notice Rate a tutor
    /// @param tutor Tutor address
    /// @param sessionId Session ID
    /// @param rating Rating (1-5)
    function rateTutor(address tutor, uint256 sessionId, uint256 rating) external {
        tutorRegistry.rateTutor(tutor, sessionId, rating);
    }
    
    // ============ Session Functions ============
    
    /// @notice Create a new learning session
    /// @param tutor Tutor address
    /// @param duration Session duration in seconds
    /// @param subject Subject being taught
    /// @param description Session description
    /// @return sessionId Created session ID
    function bookSession(
        address tutor,
        uint256 duration,
        string calldata subject,
        string calldata description
    ) external payable returns (uint256 sessionId) {
        return sessionEscrow.createSession{value: msg.value}(tutor, duration, subject, description);
    }
    
    /// @notice Complete a session
    /// @param sessionId Session ID
    function completeSession(uint256 sessionId) external {
        sessionEscrow.completeSession(sessionId);
    }
    
    /// @notice Cancel a session
    /// @param sessionId Session ID
    function cancelSession(uint256 sessionId) external {
        sessionEscrow.cancelSession(sessionId);
    }
    
    /// @notice Release payment to tutor
    /// @param sessionId Session ID
    function releasePayment(uint256 sessionId) external {
        sessionEscrow.releasePayment(sessionId);
    }
    
    /// @notice Get session details
    /// @param sessionId Session ID
    /// @return SessionLib.Session Session data
    function getSession(uint256 sessionId) external view returns (SessionLib.Session memory) {
        return sessionEscrow.getSession(sessionId);
    }
    
    /// @notice Get session metadata
    /// @param sessionId Session ID
    /// @return SessionLib.SessionMetadata Session metadata
    function getSessionMetadata(uint256 sessionId) external view returns (SessionLib.SessionMetadata memory) {
        return sessionEscrow.getSessionMetadata(sessionId);
    }
    
    /// @notice Get total number of sessions
    /// @return uint256 Total session count
    function getTotalSessions() external view returns (uint256) {
        return sessionEscrow.getTotalSessions();
    }
    
    // ============ Dispute Functions ============
    
    /// @notice Raise a dispute for a session
    /// @param sessionId Session ID
    /// @param reason Dispute reason
    /// @param evidence Evidence (IPFS hash)
    /// @return disputeId Created dispute ID
    function raiseDispute(
        uint256 sessionId,
        string calldata reason,
        string calldata evidence
    ) external returns (uint256 disputeId) {
        return disputeResolver.raiseDispute(sessionId, reason, evidence);
    }
    
    /// @notice Submit additional evidence
    /// @param disputeId Dispute ID
    /// @param evidence Evidence (IPFS hash)
    function submitDisputeEvidence(uint256 disputeId, string calldata evidence) external {
        disputeResolver.submitEvidence(disputeId, evidence);
    }
    
    /// @notice Get dispute details
    /// @param disputeId Dispute ID
    /// @return DisputeLib.Dispute Dispute data
    function getDispute(uint256 disputeId) external view returns (DisputeLib.Dispute memory) {
        return disputeResolver.getDispute(disputeId);
    }
    
    /// @notice Get dispute for a session
    /// @param sessionId Session ID
    /// @return uint256 Dispute ID
    function getSessionDispute(uint256 sessionId) external view returns (uint256) {
        return disputeResolver.getDisputeBySession(sessionId);
    }
    
    // ============ Certificate Functions ============
    
    /// @notice Mint a certificate for a completed session
    /// @param sessionId Session ID
    /// @param subject Subject
    /// @param metadataURI Metadata URI (IPFS hash)
    /// @return tokenId Minted certificate token ID
    function mintCertificate(
        uint256 sessionId,
        string calldata subject,
        string calldata metadataURI
    ) external returns (uint256 tokenId) {
        return certificateNFT.mintCertificate(msg.sender, sessionId, subject, metadataURI);
    }
    
    /// @notice Get certificate details
    /// @param tokenId Certificate token ID
    /// @return ICertificateNFT.CertificateMetadata Certificate data
    function getCertificate(uint256 tokenId) external view returns (ICertificateNFT.CertificateMetadata memory) {
        return certificateNFT.getCertificate(tokenId);
    }
    
    /// @notice Get all certificates for a student
    /// @param student Student address
    /// @return uint256[] Array of certificate token IDs
    function getStudentCertificates(address student) external view returns (uint256[] memory) {
        return certificateNFT.getStudentCertificates(student);
    }
    
    /// @notice Check if session has a certificate
    /// @param sessionId Session ID
    /// @return bool True if certificate exists
    function hasCertificate(uint256 sessionId) external view returns (bool) {
        return certificateNFT.hasCertificate(sessionId);
    }
    
    // ============ Platform Stats ============
    
    /// @notice Get platform statistics
    /// @return totalSessions Total number of sessions
    /// @return totalDisputes Total number of disputes
    /// @return totalCertificates Total number of certificates
    function getPlatformStats() external view returns (
        uint256 totalSessions,
        uint256 totalDisputes,
        uint256 totalCertificates
    ) {
        totalSessions = sessionEscrow.getTotalSessions();
        totalDisputes = disputeResolver.getTotalDisputes();
        totalCertificates = certificateNFT.getTotalCertificates();
    }
    
    /// @notice Get all contract addresses
    /// @return _tutorRegistry Tutor registry address
    /// @return _sessionEscrow Session escrow address
    /// @return _disputeResolver Dispute resolver address
    /// @return _certificateNFT Certificate NFT address
    function getContractAddresses() external view returns (
        address _tutorRegistry,
        address _sessionEscrow,
        address _disputeResolver,
        address _certificateNFT
    ) {
        return (
            address(tutorRegistry),
            address(sessionEscrow),
            address(disputeResolver),
            address(certificateNFT)
        );
    }
}


// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {PeerLearningHub} from "../src/PeerLearningHub.sol";
import {ITutorRegistry} from "../src/interfaces/ITutorRegistry.sol";

/// @title Interact
/// @notice Script for interacting with deployed contracts
contract Interact is Script {
    PeerLearningHub public hub;
    
    function setUp() public {
        // Load deployed hub address from environment
        address hubAddress = vm.envAddress("HUB_ADDRESS");
        hub = PeerLearningHub(hubAddress);
    }
    
    /// @notice Register a tutor
    function registerTutor() public {
        uint256 privateKey = vm.envUint("PRIVATE_KEY");
        
        string[] memory subjects = new string[](3);
        subjects[0] = "Smart Contract Development";
        subjects[1] = "Solidity Fundamentals";
        subjects[2] = "DeFi Strategy";
        
        uint256 hourlyRate = 0.05 ether;
        
        vm.startBroadcast(privateKey);
        hub.registerAsTutor(subjects, hourlyRate);
        vm.stopBroadcast();
        
        console.log("Tutor registered successfully");
    }
    
    /// @notice Book a session
    function bookSession() public {
        uint256 privateKey = vm.envUint("PRIVATE_KEY");
        address tutor = vm.envAddress("TUTOR_ADDRESS");
        
        uint256 duration = 1 hours;
        string memory subject = "Smart Contract Development";
        string memory description = "Learn Solidity basics and deploy your first contract";
        
        // Calculate payment (tutor's hourly rate * duration)
        ITutorRegistry.TutorProfile memory profile = hub.getTutorProfile(tutor);
        uint256 payment = (profile.hourlyRate * duration) / 1 hours;
        
        vm.startBroadcast(privateKey);
        uint256 sessionId = hub.bookSession{value: payment}(tutor, duration, subject, description);
        vm.stopBroadcast();
        
        console.log("Session booked with ID:", sessionId);
    }
    
    /// @notice Complete a session
    function completeSession() public {
        uint256 privateKey = vm.envUint("PRIVATE_KEY");
        uint256 sessionId = vm.envUint("SESSION_ID");
        
        vm.startBroadcast(privateKey);
        hub.completeSession(sessionId);
        vm.stopBroadcast();
        
        console.log("Session completed:", sessionId);
    }
    
    /// @notice Rate a tutor
    function rateTutor() public {
        uint256 privateKey = vm.envUint("PRIVATE_KEY");
        address tutor = vm.envAddress("TUTOR_ADDRESS");
        uint256 sessionId = vm.envUint("SESSION_ID");
        uint256 rating = 5;
        
        vm.startBroadcast(privateKey);
        hub.rateTutor(tutor, sessionId, rating);
        vm.stopBroadcast();
        
        console.log("Tutor rated successfully");
    }
    
    /// @notice Mint a certificate
    function mintCertificate() public {
        uint256 privateKey = vm.envUint("PRIVATE_KEY");
        uint256 sessionId = vm.envUint("SESSION_ID");
        string memory subject = "Smart Contract Development";
        string memory metadataURI = "ipfs://QmExample123456789";
        
        vm.startBroadcast(privateKey);
        uint256 tokenId = hub.mintCertificate(sessionId, subject, metadataURI);
        vm.stopBroadcast();
        
        console.log("Certificate minted with token ID:", tokenId);
    }
    
    /// @notice Get platform statistics
    function getPlatformStats() public view {
        (
            uint256 totalSessions,
            uint256 totalDisputes,
            uint256 totalCertificates
        ) = hub.getPlatformStats();
        
        console.log("=== Platform Statistics ===");
        console.log("Total Sessions:", totalSessions);
        console.log("Total Disputes:", totalDisputes);
        console.log("Total Certificates:", totalCertificates);
        console.log("===========================");
    }
}


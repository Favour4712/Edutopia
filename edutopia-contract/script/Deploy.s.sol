// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {PeerLearningHub} from "../src/PeerLearningHub.sol";
import {TutorRegistry} from "../src/core/TutorRegistry.sol";
import {SessionEscrow} from "../src/core/SessionEscrow.sol";
import {DisputeResolver} from "../src/core/DisputeResolver.sol";
import {CertificateNFT} from "../src/tokens/CertificateNFT.sol";
import {MockUSDC} from "../src/tokens/MockUSDC.sol";

/// @title Deploy
/// @notice Deployment script for Peer Learning Marketplace
contract Deploy is Script {
    function run() external returns (PeerLearningHub hub) {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

        vm.startBroadcast(deployerPrivateKey);

        // Deploy contracts individually
        TutorRegistry tutorRegistry = new TutorRegistry();
        MockUSDC usdc = new MockUSDC(1 hours);
        SessionEscrow sessionEscrow = new SessionEscrow(
            address(tutorRegistry),
            address(usdc)
        );
        DisputeResolver disputeResolver = new DisputeResolver(
            address(sessionEscrow),
            48 hours
        );
        CertificateNFT certificateNFT = new CertificateNFT(
            address(sessionEscrow)
        );

        // Wire contracts together
        tutorRegistry.setSessionEscrow(address(sessionEscrow));
        sessionEscrow.setDisputeResolver(address(disputeResolver));

        // Deploy hub with contract addresses
        hub = new PeerLearningHub(
            address(tutorRegistry),
            address(sessionEscrow),
            address(disputeResolver),
            address(certificateNFT),
            address(usdc)
        );

        // Transfer ownership to hub
        sessionEscrow.transferOwnership(address(hub));
        disputeResolver.transferOwnership(address(hub));

        // Log deployment addresses
        console.log("=== Peer Learning Marketplace Deployed ===");
        console.log("PeerLearningHub:", address(hub));
        console.log("TutorRegistry:", address(tutorRegistry));
        console.log("SessionEscrow:", address(sessionEscrow));
        console.log("DisputeResolver:", address(disputeResolver));
        console.log("CertificateNFT:", address(certificateNFT));
        console.log("MockUSDC:", address(usdc));
        console.log("=========================================");

        vm.stopBroadcast();

        return hub;
    }
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {PeerLearningHub} from "../src/PeerLearningHub.sol";

/// @title Deploy
/// @notice Deployment script for Peer Learning Marketplace
contract Deploy is Script {
    function run() external returns (PeerLearningHub hub) {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        
        vm.startBroadcast(deployerPrivateKey);
        
        // Deploy the hub (which deploys all other contracts)
        hub = new PeerLearningHub();
        
        // Get contract addresses
        (
            address tutorRegistry,
            address sessionEscrow,
            address disputeResolver,
            address certificateNFT
        ) = hub.getContractAddresses();
        
        // Log deployment addresses
        console.log("=== Peer Learning Marketplace Deployed ===");
        console.log("PeerLearningHub:", address(hub));
        console.log("TutorRegistry:", tutorRegistry);
        console.log("SessionEscrow:", sessionEscrow);
        console.log("DisputeResolver:", disputeResolver);
        console.log("CertificateNFT:", certificateNFT);
        console.log("=========================================");
        
        vm.stopBroadcast();
        
        return hub;
    }
}


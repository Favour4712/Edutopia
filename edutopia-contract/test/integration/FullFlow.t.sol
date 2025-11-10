// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test} from "forge-std/Test.sol";
import {PeerLearningHub} from "../../src/PeerLearningHub.sol";
import {TutorRegistry} from "../../src/core/TutorRegistry.sol";
import {SessionEscrow} from "../../src/core/SessionEscrow.sol";
import {DisputeResolver} from "../../src/core/DisputeResolver.sol";
import {CertificateNFT} from "../../src/tokens/CertificateNFT.sol";
import {SessionLib} from "../../src/libraries/SessionLib.sol";
import {DisputeLib} from "../../src/libraries/DisputeLib.sol";
import {ITutorRegistry} from "../../src/interfaces/ITutorRegistry.sol";
import {ICertificateNFT} from "../../src/interfaces/ICertificateNFT.sol";
import {MockUSDC} from "../../src/tokens/MockUSDC.sol";

contract FullFlowTest is Test {
    PeerLearningHub public hub;
    TutorRegistry public tutorRegistry;
    SessionEscrow public sessionEscrow;
    DisputeResolver public disputeResolver;
    CertificateNFT public certificateNFT;
    MockUSDC public usdc;

    address public owner = address(this);
    address public tutor = makeAddr("tutor");
    address public student = makeAddr("student");
    address public arbiter = makeAddr("arbiter");

    uint256 public constant HOURLY_RATE = 50 * 1e6;
    uint256 public constant DURATION = 1 hours;
    uint256 public constant INITIAL_BALANCE = 10_000 * 1e6;
    string public constant SUBJECT = "Smart Contract Development";
    string public constant DESCRIPTION =
        "Learn Solidity basics and deploy your first contract";

    function setUp() public {
        // Deploy contracts individually
        tutorRegistry = new TutorRegistry();
        usdc = new MockUSDC(1 hours);
        sessionEscrow = new SessionEscrow(
            address(tutorRegistry),
            address(usdc)
        );
        disputeResolver = new DisputeResolver(address(sessionEscrow), 48 hours);
        certificateNFT = new CertificateNFT(address(sessionEscrow));

        // Wire contracts together
        tutorRegistry.setSessionEscrow(address(sessionEscrow));
        sessionEscrow.setDisputeResolver(address(disputeResolver));

        // Deploy hub
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

        // Fund accounts
        usdc.mint(student, INITIAL_BALANCE);
        usdc.mint(tutor, INITIAL_BALANCE);
        usdc.mint(address(this), INITIAL_BALANCE);

        vm.prank(student);
        usdc.approve(address(sessionEscrow), type(uint256).max);

        vm.prank(tutor);
        usdc.approve(address(sessionEscrow), type(uint256).max);

        vm.label(address(usdc), "MockUSDC");
        vm.label(address(sessionEscrow), "SessionEscrow");
        vm.label(address(tutorRegistry), "TutorRegistry");
        vm.label(address(disputeResolver), "DisputeResolver");
    }

    function test_CompleteFlow_HappyPath() public {
        // 1. Tutor registers
        string[] memory subjects = new string[](3);
        subjects[0] = "Smart Contract Development";
        subjects[1] = "Solidity Fundamentals";
        subjects[2] = "DeFi Strategy";

        vm.prank(tutor);
        hub.registerAsTutor(subjects, HOURLY_RATE);

        // Verify tutor is registered
        ITutorRegistry.TutorProfile memory profile = hub.getTutorProfile(tutor);
        assertTrue(profile.isRegistered, "Tutor should be registered");
        assertEq(profile.hourlyRate, HOURLY_RATE, "Hourly rate should match");

        // 2. Student books a session
        vm.prank(student);
        uint256 sessionId = hub.bookSession(
            tutor,
            DURATION,
            SUBJECT,
            DESCRIPTION
        );

        // Verify session created
        SessionLib.Session memory session = hub.getSession(sessionId);
        assertEq(session.student, student);
        assertEq(session.tutor, tutor);
        assertEq(session.amount, HOURLY_RATE);

        // 3. Time passes, session completes
        vm.warp(block.timestamp + DURATION + 1);

        vm.prank(tutor);
        hub.completeSession(sessionId);

        session = hub.getSession(sessionId);
        assertTrue(session.status == SessionLib.SessionStatus.Completed);

        // 4. Student rates tutor
        vm.prank(student);
        hub.rateTutor(tutor, sessionId, 5);

        profile = hub.getTutorProfile(tutor);
        assertEq(profile.ratingCount, 1);
        assertEq(profile.totalRating, 5);

        // 5. Dispute window passes, payment released
        vm.warp(block.timestamp + 48 hours + 1);

        uint256 tutorBalanceBefore = usdc.balanceOf(tutor);
        hub.releasePayment(sessionId);
        uint256 tutorBalanceAfter = usdc.balanceOf(tutor);

        // Verify tutor received payment minus 2.5% fee
        uint256 expectedPayment = (HOURLY_RATE * 9750) / 10000;
        assertEq(tutorBalanceAfter - tutorBalanceBefore, expectedPayment);

        // 6. Student mints certificate
        string memory metadataURI = "ipfs://QmExample123456789";

        vm.prank(student);
        uint256 tokenId = hub.mintCertificate(sessionId, SUBJECT, metadataURI);

        // Verify certificate minted
        ICertificateNFT.CertificateMetadata memory cert = hub.getCertificate(
            tokenId
        );
        assertEq(cert.student, student);
        assertEq(cert.tutor, tutor);
        assertEq(cert.sessionId, sessionId);

        // 7. Check platform stats
        (
            uint256 totalSessions,
            uint256 totalDisputes,
            uint256 totalCertificates
        ) = hub.getPlatformStats();
        assertEq(totalSessions, 1);
        assertEq(totalDisputes, 0);
        assertEq(totalCertificates, 1);
    }

    function test_CompleteFlow_WithDispute() public {
        // 1. Setup: Register tutor and book session
        string[] memory subjects = new string[](1);
        subjects[0] = SUBJECT;

        vm.prank(tutor);
        hub.registerAsTutor(subjects, HOURLY_RATE);

        vm.prank(student);
        uint256 sessionId = hub.bookSession(
            tutor,
            DURATION,
            SUBJECT,
            DESCRIPTION
        );

        // 2. Complete session
        vm.warp(block.timestamp + DURATION + 1);

        vm.prank(tutor);
        hub.completeSession(sessionId);

        // 3. Student raises dispute
        string memory reason = "Tutor did not cover promised topics";
        string memory evidence = "ipfs://QmEvidence123";

        vm.prank(student);
        uint256 disputeId = hub.raiseDispute(sessionId, reason, evidence);

        // Verify dispute created
        DisputeLib.Dispute memory dispute = hub.getDispute(disputeId);
        assertEq(dispute.sessionId, sessionId);
        assertEq(dispute.raisedBy, student);
        assertTrue(dispute.status == DisputeLib.DisputeStatus.Open);

        // 4. Add arbiter and resolve dispute
        hub.addArbiter(arbiter);

        // Arbiter resolves in favor of student (full refund)
        (, , address disputeResolverAddr, , ) = hub.getContractAddresses();
        vm.prank(arbiter);
        (bool success, ) = disputeResolverAddr.call(
            abi.encodeWithSignature(
                "resolveDispute(uint256,uint8)",
                disputeId,
                uint8(DisputeLib.DisputeOutcome.RefundStudent)
            )
        );
        assertTrue(success, "Resolve dispute should succeed");

        // Verify dispute resolved
        dispute = hub.getDispute(disputeId);
        assertTrue(dispute.status == DisputeLib.DisputeStatus.Resolved);
        assertTrue(dispute.outcome == DisputeLib.DisputeOutcome.RefundStudent);

        // 5. Check platform stats
        (uint256 totalSessions, uint256 totalDisputes, ) = hub
            .getPlatformStats();
        assertEq(totalSessions, 1);
        assertEq(totalDisputes, 1);
    }

    function test_CompleteFlow_CannotCancelActiveSession() public {
        // 1. Register tutor
        string[] memory subjects = new string[](1);
        subjects[0] = SUBJECT;

        vm.prank(tutor);
        hub.registerAsTutor(subjects, HOURLY_RATE);

        // 2. Book session
        vm.prank(student);
        uint256 sessionId = hub.bookSession(
            tutor,
            DURATION,
            SUBJECT,
            DESCRIPTION
        );

        // 3. Cannot cancel active session (starts immediately)
        vm.prank(student);
        vm.expectRevert();
        hub.cancelSession(sessionId);

        // Verify session status is still active
        SessionLib.Session memory session = hub.getSession(sessionId);
        assertTrue(session.status == SessionLib.SessionStatus.Active);
    }

    function test_MultipleTutorsAndSessions() public {
        address tutor2 = makeAddr("tutor2");
        address student2 = makeAddr("student2");

        usdc.mint(student2, INITIAL_BALANCE);

        vm.prank(student2);
        usdc.approve(address(sessionEscrow), type(uint256).max);

        // Register multiple tutors
        string[] memory subjects1 = new string[](1);
        subjects1[0] = "Smart Contract Development";

        string[] memory subjects2 = new string[](1);
        subjects2[0] = "DeFi Strategy";

        vm.prank(tutor);
        hub.registerAsTutor(subjects1, HOURLY_RATE);

        vm.prank(tutor2);
        hub.registerAsTutor(subjects2, HOURLY_RATE * 2);

        // Multiple students book sessions
        vm.prank(student);
        uint256 session1 = hub.bookSession(
            tutor,
            DURATION,
            subjects1[0],
            DESCRIPTION
        );

        vm.prank(student2);
        uint256 session2 = hub.bookSession(
            tutor2,
            DURATION,
            subjects2[0],
            DESCRIPTION
        );

        // Verify both sessions created
        assertTrue(session1 != session2);

        SessionLib.Session memory s1 = hub.getSession(session1);
        SessionLib.Session memory s2 = hub.getSession(session2);

        assertEq(s1.tutor, tutor);
        assertEq(s2.tutor, tutor2);
        assertEq(s1.student, student);
        assertEq(s2.student, student2);

        // Check total sessions
        (uint256 totalSessions, , ) = hub.getPlatformStats();
        assertEq(totalSessions, 2);
    }
}

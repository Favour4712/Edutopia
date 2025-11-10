// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test} from "forge-std/Test.sol";
import {SessionEscrow} from "../../src/core/SessionEscrow.sol";
import {TutorRegistry} from "../../src/core/TutorRegistry.sol";
import {SessionLib} from "../../src/libraries/SessionLib.sol";
import {Errors} from "../../src/utils/Errors.sol";
import {MockUSDC} from "../../src/tokens/MockUSDC.sol";

contract SessionEscrowTest is Test {
    SessionEscrow public escrow;
    TutorRegistry public registry;
    MockUSDC public usdc;

    address public tutor = makeAddr("tutor");
    address public student = makeAddr("student");
    address public sink = makeAddr("sink");

    uint256 public constant HOURLY_RATE = 50 * 1e6; // 50 USDC
    uint256 public constant DURATION = 1 hours;
    uint256 public constant INITIAL_BALANCE = 10_000 * 1e6;
    string public constant SUBJECT = "Smart Contract Development";
    string public constant DESCRIPTION = "Learn Solidity basics";

    function setUp() public {
        registry = new TutorRegistry();
        usdc = new MockUSDC(1 hours);
        escrow = new SessionEscrow(address(registry), address(usdc));
        registry.setSessionEscrow(address(escrow));

        // Register tutor
        string[] memory subjects = new string[](1);
        subjects[0] = SUBJECT;
        vm.prank(tutor);
        registry.registerTutor(subjects, HOURLY_RATE);

        // Mint tokens to participants
        usdc.mint(student, INITIAL_BALANCE);
        usdc.mint(tutor, INITIAL_BALANCE);
        usdc.mint(address(this), INITIAL_BALANCE); // treasury for fee withdrawal checks

        // Approve escrow to pull funds
        vm.prank(student);
        usdc.approve(address(escrow), type(uint256).max);
    }

    function test_CreateSession() public {
        uint256 escrowBalanceBefore = usdc.balanceOf(address(escrow));

        vm.prank(student);
        uint256 sessionId = escrow.createSession(tutor, DURATION, SUBJECT, DESCRIPTION);

        SessionLib.Session memory session = escrow.getSession(sessionId);
        assertEq(session.id, sessionId);
        assertEq(session.student, student);
        assertEq(session.tutor, tutor);
        assertEq(session.amount, HOURLY_RATE);
        assertEq(session.duration, DURATION);
        assertTrue(session.status == SessionLib.SessionStatus.Active);

        assertEq(usdc.balanceOf(address(escrow)) - escrowBalanceBefore, HOURLY_RATE);
    }

    function test_RevertWhen_InsufficientPayment() public {
        address lowBalanceStudent = makeAddr("low");
        usdc.mint(lowBalanceStudent, HOURLY_RATE / 2);

        vm.startPrank(lowBalanceStudent);
        usdc.approve(address(escrow), type(uint256).max);
        vm.expectRevert(Errors.InsufficientPayment.selector);
        escrow.createSession(tutor, DURATION, SUBJECT, DESCRIPTION);
        vm.stopPrank();
    }

    function test_RevertWhen_InsufficientAllowance() public {
        address noAllowanceStudent = makeAddr("no-allowance");
        usdc.mint(noAllowanceStudent, HOURLY_RATE);

        vm.startPrank(noAllowanceStudent);
        vm.expectRevert(Errors.InsufficientAllowance.selector);
        escrow.createSession(tutor, DURATION, SUBJECT, DESCRIPTION);
        vm.stopPrank();
    }

    function test_RevertWhen_TutorNotRegistered() public {
        address unregisteredTutor = makeAddr("unregistered");

        vm.prank(student);
        vm.expectRevert(Errors.TutorNotRegistered.selector);
        escrow.createSession(unregisteredTutor, DURATION, SUBJECT, DESCRIPTION);
    }

    function test_CompleteSession() public {
        vm.prank(student);
        uint256 sessionId = escrow.createSession(tutor, DURATION, SUBJECT, DESCRIPTION);

        vm.warp(block.timestamp + DURATION + 1);

        vm.prank(tutor);
        escrow.completeSession(sessionId);

        SessionLib.Session memory session = escrow.getSession(sessionId);
        assertTrue(session.status == SessionLib.SessionStatus.Completed);
    }

    function test_RevertWhen_CancellingActiveSession() public {
        vm.prank(student);
        uint256 sessionId = escrow.createSession(tutor, DURATION, SUBJECT, DESCRIPTION);

        vm.prank(student);
        vm.expectRevert(Errors.CannotCancelActiveSession.selector);
        escrow.cancelSession(sessionId);
    }

    function test_ReleasePayment() public {
        vm.prank(student);
        uint256 sessionId = escrow.createSession(tutor, DURATION, SUBJECT, DESCRIPTION);

        vm.warp(block.timestamp + DURATION + 1);
        vm.prank(tutor);
        escrow.completeSession(sessionId);

        vm.warp(block.timestamp + 48 hours + 1);

        uint256 tutorBalanceBefore = usdc.balanceOf(tutor);
        vm.prank(student); // anyone can trigger release
        escrow.releasePayment(sessionId);
        uint256 tutorBalanceAfter = usdc.balanceOf(tutor);

        uint256 expectedPayment = (HOURLY_RATE * 9750) / 10000;
        assertEq(tutorBalanceAfter - tutorBalanceBefore, expectedPayment);
    }

    function test_PauseUnpause() public {
        escrow.pauseContract();

        vm.prank(student);
        vm.expectRevert();
        escrow.createSession(tutor, DURATION, SUBJECT, DESCRIPTION);

        escrow.unpauseContract();

        vm.prank(student);
        uint256 sessionId = escrow.createSession(tutor, DURATION, SUBJECT, DESCRIPTION);

        assertTrue(sessionId > 0);
    }

    function test_WithdrawFees() public {
        vm.prank(student);
        uint256 sessionId = escrow.createSession(tutor, DURATION, SUBJECT, DESCRIPTION);

        vm.warp(block.timestamp + DURATION + 1);
        vm.prank(tutor);
        escrow.completeSession(sessionId);

        vm.warp(block.timestamp + 48 hours + 1);
        escrow.releasePayment(sessionId);

        uint256 expectedFee = (HOURLY_RATE * 250) / 10000;
        address contractOwner = escrow.owner();
        uint256 balanceBefore = usdc.balanceOf(contractOwner);

        vm.prank(contractOwner);
        escrow.withdrawFees();

        uint256 balanceAfter = usdc.balanceOf(contractOwner);
        assertEq(balanceAfter - balanceBefore, expectedFee);
    }

    function testFuzz_CreateSession(uint256 duration) public {
        vm.assume(duration >= 30 minutes && duration <= 8 hours);

        vm.prank(student);
        uint256 sessionId = escrow.createSession(tutor, duration, SUBJECT, DESCRIPTION);

        SessionLib.Session memory session = escrow.getSession(sessionId);
        assertEq(session.duration, duration);
    }
}

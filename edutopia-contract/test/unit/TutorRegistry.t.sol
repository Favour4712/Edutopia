// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test} from "forge-std/Test.sol";
import {TutorRegistry} from "../../src/core/TutorRegistry.sol";
import {ITutorRegistry} from "../../src/interfaces/ITutorRegistry.sol";
import {Errors} from "../../src/utils/Errors.sol";

contract TutorRegistryTest is Test {
    TutorRegistry public registry;

    address public owner = address(this);
    address public tutor1 = makeAddr("tutor1");
    address public tutor2 = makeAddr("tutor2");
    address public student = makeAddr("student");
    address public sessionEscrow = makeAddr("sessionEscrow");

    string[] public subjects;
    uint256 public constant HOURLY_RATE = 50 * 1e6;

    function setUp() public {
        registry = new TutorRegistry();
        registry.setSessionEscrow(sessionEscrow);

        subjects.push("Smart Contract Development");
        subjects.push("Solidity Fundamentals");
        subjects.push("DeFi Strategy");
    }

    function test_RegisterTutor() public {
        vm.prank(tutor1);
        registry.registerTutor(subjects, HOURLY_RATE);

        ITutorRegistry.TutorProfile memory profile = registry.getTutorProfile(
            tutor1
        );

        assertTrue(profile.isRegistered);
        assertEq(profile.subjects.length, 3);
        assertEq(profile.hourlyRate, HOURLY_RATE);
        assertEq(profile.totalSessions, 0);
        assertEq(profile.totalRating, 0);
        assertEq(profile.ratingCount, 0);
    }

    function test_RevertWhen_RegisteringTwice() public {
        vm.startPrank(tutor1);
        registry.registerTutor(subjects, HOURLY_RATE);

        vm.expectRevert(Errors.TutorAlreadyRegistered.selector);
        registry.registerTutor(subjects, HOURLY_RATE);
        vm.stopPrank();
    }

    function test_GetTutorEnumeration() public {
        vm.prank(tutor1);
        registry.registerTutor(subjects, HOURLY_RATE);

        vm.prank(tutor2);
        registry.registerTutor(subjects, HOURLY_RATE);

        assertEq(registry.getTutorCount(), 2);

        address[] memory allTutors = registry.getAllTutors();
        assertEq(allTutors.length, 2);
        assertEq(allTutors[0], tutor1);
        assertEq(allTutors[1], tutor2);

        address[] memory slice = registry.getTutorAddresses(1, 1);
        assertEq(slice.length, 1);
        assertEq(slice[0], tutor2);

        address[] memory remainder = registry.getTutorAddresses(1, 0);
        assertEq(remainder.length, 1);
        assertEq(remainder[0], tutor2);

        address[] memory empty = registry.getTutorAddresses(5, 2);
        assertEq(empty.length, 0);
    }

    function test_RevertWhen_EmptySubjects() public {
        string[] memory emptySubjects = new string[](0);

        vm.prank(tutor1);
        vm.expectRevert(Errors.EmptySubjects.selector);
        registry.registerTutor(emptySubjects, HOURLY_RATE);
    }

    function test_RevertWhen_InvalidHourlyRate() public {
        vm.startPrank(tutor1);

        // Too low
        vm.expectRevert(Errors.InvalidHourlyRate.selector);
        registry.registerTutor(subjects, 1 * 1e6);

        // Too high
        vm.expectRevert(Errors.InvalidHourlyRate.selector);
        registry.registerTutor(subjects, 2_000 * 1e6);

        vm.stopPrank();
    }

    function test_UpdateHourlyRate() public {
        vm.startPrank(tutor1);
        registry.registerTutor(subjects, HOURLY_RATE);

        uint256 newRate = 75 * 1e6;
        registry.updateHourlyRate(newRate);

        ITutorRegistry.TutorProfile memory profile = registry.getTutorProfile(
            tutor1
        );
        assertEq(profile.hourlyRate, newRate);
        vm.stopPrank();
    }

    function test_RateTutor() public {
        // Register tutor
        vm.prank(tutor1);
        registry.registerTutor(subjects, HOURLY_RATE);

        // Rate tutor
        uint256 sessionId = 1;
        uint256 rating = 5;

        vm.prank(student);
        registry.rateTutor(tutor1, sessionId, rating);

        ITutorRegistry.TutorProfile memory profile = registry.getTutorProfile(
            tutor1
        );
        assertEq(profile.totalRating, rating);
        assertEq(profile.ratingCount, 1);

        // Check average rating (scaled by 100)
        uint256 avgRating = registry.getTutorRating(tutor1);
        assertEq(avgRating, 500); // 5.00 * 100
    }

    function test_RevertWhen_RatingSelf() public {
        vm.startPrank(tutor1);
        registry.registerTutor(subjects, HOURLY_RATE);

        vm.expectRevert(Errors.CannotRateSelf.selector);
        registry.rateTutor(tutor1, 1, 5);
        vm.stopPrank();
    }

    function test_RevertWhen_RatingTwice() public {
        vm.prank(tutor1);
        registry.registerTutor(subjects, HOURLY_RATE);

        uint256 sessionId = 1;

        vm.startPrank(student);
        registry.rateTutor(tutor1, sessionId, 5);

        vm.expectRevert(Errors.AlreadyRatedThisSession.selector);
        registry.rateTutor(tutor1, sessionId, 4);
        vm.stopPrank();
    }

    function test_IncrementSessionCount() public {
        vm.prank(tutor1);
        registry.registerTutor(subjects, HOURLY_RATE);

        vm.prank(sessionEscrow);
        registry.incrementSessionCount(tutor1);

        ITutorRegistry.TutorProfile memory profile = registry.getTutorProfile(
            tutor1
        );
        assertEq(profile.totalSessions, 1);
    }

    function test_IsTutorRegistered() public {
        assertFalse(registry.isTutorRegistered(tutor1));

        vm.prank(tutor1);
        registry.registerTutor(subjects, HOURLY_RATE);

        assertTrue(registry.isTutorRegistered(tutor1));
    }

    function testFuzz_RateTutor(uint256 rating) public {
        vm.assume(rating >= 1 && rating <= 5);

        vm.prank(tutor1);
        registry.registerTutor(subjects, HOURLY_RATE);

        vm.prank(student);
        registry.rateTutor(tutor1, 1, rating);

        uint256 avgRating = registry.getTutorRating(tutor1);
        assertEq(avgRating, rating * 100);
    }
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ICertificateNFT} from "../interfaces/ICertificateNFT.sol";
import {ISessionEscrow} from "../interfaces/ISessionEscrow.sol";
import {SessionLib} from "../libraries/SessionLib.sol";
import {Errors} from "../utils/Errors.sol";
import {Events} from "../utils/Events.sol";

/// @title CertificateNFT
/// @notice ERC721-like NFT for learning certificates
/// @dev Simplified ERC721 implementation for certificates
contract CertificateNFT is ICertificateNFT {
    // ============ State Variables ============

    /// @notice Session escrow contract
    ISessionEscrow public sessionEscrow;

    /// @notice Token name
    string public name = "Edutopia Learning Certificate";

    /// @notice Token symbol
    string public symbol = "EDULEARN";

    /// @notice Mapping from token ID to certificate metadata
    mapping(uint256 => CertificateMetadata) private certificates;

    /// @notice Mapping from session ID to token ID
    mapping(uint256 => uint256) private sessionCertificates;

    /// @notice Mapping from token ID to owner
    mapping(uint256 => address) private tokenOwners;

    /// @notice Mapping from owner to token count
    mapping(address => uint256) private balances;

    /// @notice Mapping from owner to list of owned token IDs
    mapping(address => uint256[]) private ownedTokens;

    /// @notice Token counter
    uint256 private tokenCounter;

    // ============ Events ============

    event Transfer(
        address indexed from,
        address indexed to,
        uint256 indexed tokenId
    );

    // ============ Constructor ============

    constructor(address _sessionEscrow) {
        if (_sessionEscrow == address(0)) {
            revert Errors.ZeroAddress();
        }
        sessionEscrow = ISessionEscrow(_sessionEscrow);
    }

    // ============ External Functions ============

    /// @inheritdoc ICertificateNFT
    function mintCertificate(
        address student,
        uint256 sessionId,
        string calldata subject,
        string calldata metadataURI
    ) external override returns (uint256 tokenId) {
        SessionLib.Session memory session = sessionEscrow.getSession(sessionId);

        // Validations
        if (session.id == 0) {
            revert Errors.SessionNotFound();
        }
        if (session.status != SessionLib.SessionStatus.Completed) {
            revert Errors.SessionNotCompleted();
        }
        if (msg.sender != student) {
            revert Errors.OnlyStudentCanMint();
        }
        if (session.student != student) {
            revert Errors.UnauthorizedAccess();
        }
        if (sessionCertificates[sessionId] != 0) {
            revert Errors.CertificateAlreadyMinted();
        }
        if (bytes(metadataURI).length == 0) {
            revert Errors.InvalidMetadata();
        }

        // Mint certificate
        tokenCounter++;
        tokenId = tokenCounter;

        certificates[tokenId] = CertificateMetadata({
            sessionId: sessionId,
            student: student,
            tutor: session.tutor,
            subject: subject,
            completedAt: session.completedAt,
            metadataURI: metadataURI
        });

        sessionCertificates[sessionId] = tokenId;
        tokenOwners[tokenId] = student;
        balances[student]++;
        ownedTokens[student].push(tokenId);

        emit Transfer(address(0), student, tokenId);
        emit Events.CertificateMinted(
            tokenId,
            student,
            sessionId,
            subject,
            metadataURI
        );

        return tokenId;
    }

    // ============ View Functions ============

    /// @inheritdoc ICertificateNFT
    function getCertificate(
        uint256 tokenId
    ) external view override returns (CertificateMetadata memory) {
        if (tokenOwners[tokenId] == address(0)) {
            revert Errors.SessionNotFound();
        }
        return certificates[tokenId];
    }

    /// @inheritdoc ICertificateNFT
    function hasCertificate(
        uint256 sessionId
    ) external view override returns (bool) {
        return sessionCertificates[sessionId] != 0;
    }

    /// @inheritdoc ICertificateNFT
    function getStudentCertificates(
        address student
    ) external view override returns (uint256[] memory) {
        return ownedTokens[student];
    }

    /// @inheritdoc ICertificateNFT
    function getTotalCertificates() external view override returns (uint256) {
        return tokenCounter;
    }

    /// @notice Get token owner
    /// @param tokenId Token ID
    /// @return address Owner address
    function ownerOf(uint256 tokenId) external view returns (address) {
        address owner = tokenOwners[tokenId];
        if (owner == address(0)) {
            revert Errors.SessionNotFound();
        }
        return owner;
    }

    /// @notice Get balance of owner
    /// @param owner Owner address
    /// @return uint256 Number of tokens owned
    function balanceOf(address owner) external view returns (uint256) {
        if (owner == address(0)) {
            revert Errors.ZeroAddress();
        }
        return balances[owner];
    }

    /// @notice Get token URI
    /// @param tokenId Token ID
    /// @return string Token URI (IPFS hash)
    function tokenURI(uint256 tokenId) external view returns (string memory) {
        if (tokenOwners[tokenId] == address(0)) {
            revert Errors.SessionNotFound();
        }
        return certificates[tokenId].metadataURI;
    }

    /// @notice Check if contract supports an interface
    /// @param interfaceId Interface ID
    /// @return bool True if interface is supported
    function supportsInterface(
        bytes4 interfaceId
    ) external pure returns (bool) {
        return
            interfaceId == 0x01ffc9a7 || // ERC165
            interfaceId == 0x80ac58cd || // ERC721
            interfaceId == 0x5b5e139f; // ERC721Metadata
    }
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ICertificateNFT} from "../interfaces/ICertificateNFT.sol";
import {ISessionEscrow} from "../interfaces/ISessionEscrow.sol";
import {SessionLib} from "../libraries/SessionLib.sol";
import {Errors} from "../utils/Errors.sol";
import {Events} from "../utils/Events.sol";
import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {ERC721URIStorage} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

/// @title CertificateNFT
/// @notice ERC721 NFT for learning certificates
/// @dev Uses OpenZeppelin's ERC721 implementation
contract CertificateNFT is ICertificateNFT, ERC721, ERC721URIStorage {
    // ============ State Variables ============

    /// @notice Session escrow contract
    ISessionEscrow public sessionEscrow;

    /// @notice Mapping from token ID to certificate metadata
    mapping(uint256 => CertificateMetadata) private certificates;

    /// @notice Mapping from session ID to token ID
    mapping(uint256 => uint256) private sessionCertificates;

    /// @notice Mapping from owner to list of owned token IDs
    mapping(address => uint256[]) private ownedTokens;

    /// @notice Token counter
    uint256 private tokenCounter;

    // ============ Constructor ============

    constructor(address _sessionEscrow) ERC721("Edutopia Learning Certificate", "EDULEARN") {
        if (_sessionEscrow == address(0)) {
            revert Errors.ZeroAddress();
        }
        sessionEscrow = ISessionEscrow(_sessionEscrow);
    }

    // ============ External Functions ============

    /// @inheritdoc ICertificateNFT
    function mintCertificate(address student, uint256 sessionId, string calldata subject, string calldata metadataURI)
        external
        override
        returns (uint256 tokenId)
    {
        return _mintCertificate(msg.sender, student, sessionId, subject, metadataURI);
    }

    /// @inheritdoc ICertificateNFT
    function mintCertificateFor(address caller, uint256 sessionId, string calldata subject, string calldata metadataURI)
        external
        override
        returns (uint256 tokenId)
    {
        return _mintCertificate(caller, caller, sessionId, subject, metadataURI);
    }

    /// @notice Internal function to mint a certificate
    function _mintCertificate(
        address caller,
        address student,
        uint256 sessionId,
        string calldata subject,
        string calldata metadataURI
    ) internal returns (uint256 tokenId) {
        SessionLib.Session memory session = sessionEscrow.getSession(sessionId);

        // Validations
        if (session.id == 0) {
            revert Errors.SessionNotFound();
        }
        if (session.status != SessionLib.SessionStatus.Completed) {
            revert Errors.SessionNotCompleted();
        }
        if (caller != student) {
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
        ownedTokens[student].push(tokenId);

        // Mint using OpenZeppelin's ERC721
        _safeMint(student, tokenId);
        _setTokenURI(tokenId, metadataURI);

        emit Events.CertificateMinted(tokenId, student, sessionId, subject, metadataURI);

        return tokenId;
    }

    // ============ View Functions ============

    /// @inheritdoc ICertificateNFT
    function getCertificate(uint256 tokenId) external view override returns (CertificateMetadata memory) {
        if (ownerOf(tokenId) == address(0)) {
            revert Errors.SessionNotFound();
        }
        return certificates[tokenId];
    }

    /// @inheritdoc ICertificateNFT
    function hasCertificate(uint256 sessionId) external view override returns (bool) {
        return sessionCertificates[sessionId] != 0;
    }

    /// @inheritdoc ICertificateNFT
    function getStudentCertificates(address student) external view override returns (uint256[] memory) {
        return ownedTokens[student];
    }

    /// @inheritdoc ICertificateNFT
    function getTotalCertificates() external view override returns (uint256) {
        return tokenCounter;
    }

    // ============ Overrides ============

    /// @notice Override tokenURI to use ERC721URIStorage
    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    /// @notice Override supportsInterface
    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}

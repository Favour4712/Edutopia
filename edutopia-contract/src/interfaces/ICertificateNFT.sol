// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title ICertificateNFT
/// @notice Interface for learning certificate NFTs
interface ICertificateNFT {
    /// @notice Certificate metadata structure
    struct CertificateMetadata {
        uint256 sessionId;
        address student;
        address tutor;
        string subject;
        uint256 completedAt;
        string metadataURI; // IPFS hash
    }

    /// @notice Mint a certificate NFT for a completed session
    /// @param student Address of the student
    /// @param sessionId ID of the completed session
    /// @param subject Subject of the session
    /// @param metadataURI IPFS hash of the certificate metadata
    /// @return tokenId The ID of the minted NFT
    function mintCertificate(
        address student,
        uint256 sessionId,
        string calldata subject,
        string calldata metadataURI
    ) external returns (uint256 tokenId);

    /// @notice Get certificate metadata
    /// @param tokenId ID of the certificate NFT
    /// @return CertificateMetadata struct
    function getCertificate(
        uint256 tokenId
    ) external view returns (CertificateMetadata memory);

    /// @notice Check if certificate exists for a session
    /// @param sessionId ID of the session
    /// @return bool True if certificate has been minted
    function hasCertificate(uint256 sessionId) external view returns (bool);

    /// @notice Get all certificates for a student
    /// @param student Address of the student
    /// @return uint256[] Array of token IDs
    function getStudentCertificates(
        address student
    ) external view returns (uint256[] memory);

    /// @notice Get total number of certificates minted
    /// @return uint256 Total certificate count
    function getTotalCertificates() external view returns (uint256);
}

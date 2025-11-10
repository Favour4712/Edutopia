export const peerLearningHubAbi = [
  {
    "type": "constructor",
    "inputs": [
      {
        "name": "_tutorRegistry",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "_sessionEscrow",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "_disputeResolver",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "_certificateNFT",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "_paymentToken",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "VERSION",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "string",
        "internalType": "string"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "addArbiter",
    "inputs": [
      {
        "name": "arbiter",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "bookSession",
    "inputs": [
      {
        "name": "tutor",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "duration",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "subject",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "description",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [
      {
        "name": "sessionId",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "cancelSession",
    "inputs": [
      {
        "name": "sessionId",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "certificateNFT",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "contract ICertificateNFT"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "completeSession",
    "inputs": [
      {
        "name": "sessionId",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "disputeResolver",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "contract IDisputeResolver"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getAllTutors",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address[]",
        "internalType": "address[]"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getCertificate",
    "inputs": [
      {
        "name": "tokenId",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "tuple",
        "internalType": "struct ICertificateNFT.CertificateMetadata",
        "components": [
          {
            "name": "sessionId",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "student",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "tutor",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "subject",
            "type": "string",
            "internalType": "string"
          },
          {
            "name": "completedAt",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "metadataURI",
            "type": "string",
            "internalType": "string"
          }
        ]
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getContractAddresses",
    "inputs": [],
    "outputs": [
      {
        "name": "_tutorRegistry",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "_sessionEscrow",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "_disputeResolver",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "_certificateNFT",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "_paymentToken",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getDispute",
    "inputs": [
      {
        "name": "disputeId",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "tuple",
        "internalType": "struct DisputeLib.Dispute",
        "components": [
          {
            "name": "id",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "sessionId",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "raisedBy",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "reason",
            "type": "string",
            "internalType": "string"
          },
          {
            "name": "evidence",
            "type": "string",
            "internalType": "string"
          },
          {
            "name": "status",
            "type": "uint8",
            "internalType": "enum DisputeLib.DisputeStatus"
          },
          {
            "name": "outcome",
            "type": "uint8",
            "internalType": "enum DisputeLib.DisputeOutcome"
          },
          {
            "name": "createdAt",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "resolvedAt",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "resolvedBy",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "refundAmount",
            "type": "uint256",
            "internalType": "uint256"
          }
        ]
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getPlatformStats",
    "inputs": [],
    "outputs": [
      {
        "name": "totalSessions",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "totalDisputes",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "totalCertificates",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getSession",
    "inputs": [
      {
        "name": "sessionId",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "tuple",
        "internalType": "struct SessionLib.Session",
        "components": [
          {
            "name": "id",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "student",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "tutor",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "amount",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "startTime",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "duration",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "status",
            "type": "uint8",
            "internalType": "enum SessionLib.SessionStatus"
          },
          {
            "name": "completedAt",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "paymentReleased",
            "type": "bool",
            "internalType": "bool"
          },
          {
            "name": "hasDispute",
            "type": "bool",
            "internalType": "bool"
          }
        ]
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getSessionDispute",
    "inputs": [
      {
        "name": "sessionId",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getSessionMetadata",
    "inputs": [
      {
        "name": "sessionId",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "tuple",
        "internalType": "struct SessionLib.SessionMetadata",
        "components": [
          {
            "name": "subject",
            "type": "string",
            "internalType": "string"
          },
          {
            "name": "description",
            "type": "string",
            "internalType": "string"
          },
          {
            "name": "learningObjectives",
            "type": "string[]",
            "internalType": "string[]"
          }
        ]
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getStudentCertificates",
    "inputs": [
      {
        "name": "student",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint256[]",
        "internalType": "uint256[]"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getTotalSessions",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getTutorAddresses",
    "inputs": [
      {
        "name": "offset",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "limit",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "address[]",
        "internalType": "address[]"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getTutorCount",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getTutorProfile",
    "inputs": [
      {
        "name": "tutor",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "tuple",
        "internalType": "struct ITutorRegistry.TutorProfile",
        "components": [
          {
            "name": "isRegistered",
            "type": "bool",
            "internalType": "bool"
          },
          {
            "name": "subjects",
            "type": "string[]",
            "internalType": "string[]"
          },
          {
            "name": "hourlyRate",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "totalSessions",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "totalRating",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "ratingCount",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "registeredAt",
            "type": "uint256",
            "internalType": "uint256"
          }
        ]
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "hasCertificate",
    "inputs": [
      {
        "name": "sessionId",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "mintCertificate",
    "inputs": [
      {
        "name": "sessionId",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "subject",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "metadataURI",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [
      {
        "name": "tokenId",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "owner",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "pauseSessionEscrow",
    "inputs": [],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "paymentToken",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "contract IERC20"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "raiseDispute",
    "inputs": [
      {
        "name": "sessionId",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "reason",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "evidence",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [
      {
        "name": "disputeId",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "rateTutor",
    "inputs": [
      {
        "name": "tutor",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "sessionId",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "rating",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "registerAsTutor",
    "inputs": [
      {
        "name": "subjects",
        "type": "string[]",
        "internalType": "string[]"
      },
      {
        "name": "hourlyRate",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "releasePayment",
    "inputs": [
      {
        "name": "sessionId",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "sessionEscrow",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "contract ISessionEscrow"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "submitDisputeEvidence",
    "inputs": [
      {
        "name": "disputeId",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "evidence",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "tutorRegistry",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "contract ITutorRegistry"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "unpauseSessionEscrow",
    "inputs": [],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "updateTutorRate",
    "inputs": [
      {
        "name": "newRate",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "event",
    "name": "HubDeployed",
    "inputs": [
      {
        "name": "owner",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "tutorRegistry",
        "type": "address",
        "indexed": false,
        "internalType": "address"
      },
      {
        "name": "sessionEscrow",
        "type": "address",
        "indexed": false,
        "internalType": "address"
      },
      {
        "name": "disputeResolver",
        "type": "address",
        "indexed": false,
        "internalType": "address"
      },
      {
        "name": "certificateNFT",
        "type": "address",
        "indexed": false,
        "internalType": "address"
      },
      {
        "name": "paymentToken",
        "type": "address",
        "indexed": false,
        "internalType": "address"
      }
    ],
    "anonymous": false
  },
  {
    "type": "error",
    "name": "UnauthorizedAccess",
    "inputs": []
  },
  {
    "type": "error",
    "name": "ZeroAddress",
    "inputs": []
  }
] as const;

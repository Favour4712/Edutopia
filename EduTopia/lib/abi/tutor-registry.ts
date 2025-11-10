export const tutorRegistryAbi = [
  {
    "type": "constructor",
    "inputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "MAX_HOURLY_RATE",
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
    "name": "MAX_RATING",
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
    "name": "MIN_HOURLY_RATE",
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
    "name": "MIN_RATING",
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
    "name": "getTutorRating",
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
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "incrementSessionCount",
    "inputs": [
      {
        "name": "tutor",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "isTutorRegistered",
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
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "view"
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
    "name": "registerTutor",
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
    "name": "registerTutorFor",
    "inputs": [
      {
        "name": "tutor",
        "type": "address",
        "internalType": "address"
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
        "internalType": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "setSessionEscrow",
    "inputs": [
      {
        "name": "_sessionEscrow",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "updateHourlyRate",
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
    "name": "TutorProfileUpdated",
    "inputs": [
      {
        "name": "tutor",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "newHourlyRate",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "TutorRated",
    "inputs": [
      {
        "name": "tutor",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "ratedBy",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "sessionId",
        "type": "uint256",
        "indexed": true,
        "internalType": "uint256"
      },
      {
        "name": "rating",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "TutorRegistered",
    "inputs": [
      {
        "name": "tutor",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "subjects",
        "type": "string[]",
        "indexed": false,
        "internalType": "string[]"
      },
      {
        "name": "hourlyRate",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "error",
    "name": "AlreadyRatedThisSession",
    "inputs": []
  },
  {
    "type": "error",
    "name": "CannotRateSelf",
    "inputs": []
  },
  {
    "type": "error",
    "name": "EmptySubjects",
    "inputs": []
  },
  {
    "type": "error",
    "name": "InvalidHourlyRate",
    "inputs": []
  },
  {
    "type": "error",
    "name": "InvalidRating",
    "inputs": []
  },
  {
    "type": "error",
    "name": "TutorAlreadyRegistered",
    "inputs": []
  },
  {
    "type": "error",
    "name": "TutorNotRegistered",
    "inputs": []
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

export type TutorRegistryAbi = typeof tutorRegistryAbi;

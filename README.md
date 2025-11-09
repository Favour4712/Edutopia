# 🎓 Edutopia - Decentralized Peer Learning Marketplace

> **Learn Smarter with Blockchain-Powered Tutoring**

Edutopia is a Web3-native peer learning platform where students connect with expert tutors through secure smart contract escrow, with dispute resolution mechanisms and verifiable completion certificates issued as NFTs.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Solidity](https://img.shields.io/badge/Solidity-^0.8.20-363636?logo=solidity)
![Next.js](https://img.shields.io/badge/Next.js-14+-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?logo=typescript)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Smart Contracts Setup](#smart-contracts-setup)
  - [Frontend Setup](#frontend-setup)
  - [Backend Setup](#backend-setup)
- [Smart Contracts](#smart-contracts)
- [Testing](#testing)
- [Deployment](#deployment)
- [Usage Guide](#usage-guide)
- [Contributing](#contributing)
- [Security](#security)
- [License](#license)
- [Acknowledgments](#acknowledgments)

---

## 🌟 Overview

Edutopia solves the trust problem in online education through blockchain technology:

- **💰 Secure Escrow**: Payments locked in smart contracts until session completion
- **⚖️ Dispute Resolution**: Fair arbitration system with evidence submission
- **🎖️ Verifiable Credentials**: Completion certificates as non-transferable NFTs
- **🔍 Transparent Ratings**: On-chain tutor reviews and session history
- **🚫 No Intermediaries**: Direct peer-to-peer connections with minimal platform fees

### Why Edutopia?

Traditional online tutoring platforms suffer from:
- ❌ High platform fees (20-40%)
- ❌ Payment disputes and delayed payouts
- ❌ Unverifiable credentials
- ❌ Opaque rating systems
- ❌ Centralized control

Edutopia leverages blockchain to provide:
- ✅ Low fees (2-5%)
- ✅ Instant, trustless escrow
- ✅ Blockchain-verified certificates
- ✅ Immutable reviews
- ✅ Community governance (future)

---

## ✨ Key Features

### For Students
- 🔍 **Browse & Filter Tutors**: Search by subject, rating, hourly rate, and availability
- 📅 **Book Sessions**: One-click booking with automatic escrow payment
- 💬 **Live Sessions**: Integrated video call and chat interface
- 🛡️ **Dispute Protection**: Raise disputes within 24-hour window if unsatisfied
- 🎓 **NFT Certificates**: Mint verifiable completion certificates to your wallet
- ⭐ **Rate Tutors**: Leave on-chain reviews after sessions

### For Tutors
- 📝 **Register On-Chain**: Verify your expertise and set hourly rates
- 📊 **Dashboard Analytics**: Track sessions, earnings, and ratings
- 📆 **Availability Management**: Set your schedule and recurring availability
- 💵 **Secure Payments**: Automatic payout after dispute window expires
- 🌟 **Build Reputation**: Transparent on-chain rating system

### Platform Features
- 🔐 **Smart Contract Escrow**: Funds locked until session completion or dispute resolution
- ⚖️ **Arbitration System**: Manual dispute resolution by platform arbiters
- 📜 **Immutable History**: All sessions and ratings stored on-chain
- 🌐 **IPFS Integration**: Decentralized storage for certificates and evidence
- 📱 **Responsive Design**: Works seamlessly on mobile, tablet, and desktop

---

## 🏗️ Architecture

### High-Level Overview

```
┌─────────────────┐         ┌──────────────────┐         ┌─────────────────┐
│                 │         │                  │         │                 │
│  Next.js        │◄───────►│  Smart Contracts │◄───────►│  Backend API    │
│  Frontend       │         │  (Foundry)       │         │  (Node.js)      │
│                 │         │                  │         │                 │
└────────┬────────┘         └────────┬─────────┘         └────────┬────────┘
         │                           │                            │
         │                           │                            │
         ▼                           ▼                            ▼
┌─────────────────┐         ┌──────────────────┐         ┌─────────────────┐
│                 │         │                  │         │                 │
│  wagmi + viem   │         │  Ethereum        │         │  PostgreSQL     │
│  RainbowKit     │         │  Testnet/Mainnet │         │  Redis          │
│                 │         │                  │         │                 │
└─────────────────┘         └──────────────────┘         └─────────────────┘
         │                                                         │
         │                                                         │
         └──────────────────────┬──────────────────────────────────┘
                                │
                                ▼
                        ┌──────────────────┐
                        │                  │
                        │  IPFS (Pinata)   │
                        │  Metadata Store  │
                        │                  │
                        └──────────────────┘
```

### Microservices Architecture

The backend is structured as a microservices system:

1. **User Service**: Authentication, profiles, KYC
2. **Matching Service**: Tutor recommendation algorithm
3. **Booking Service**: Session scheduling and calendar management
4. **Payment Service**: Off-chain payment tracking and reconciliation
5. **Smart Contract Service**: Blockchain interaction layer
6. **Session Service**: Video conferencing integration
7. **Dispute Service**: Evidence collection and arbitration workflow
8. **Certificate Service**: NFT metadata generation and IPFS pinning
9. **Notification Service**: Email, SMS, and push notifications
10. **Analytics Service**: Platform metrics and user dashboards

---

## 🛠️ Tech Stack

### Smart Contracts
- **Language**: Solidity ^0.8.20
- **Framework**: Foundry (Forge, Cast, Anvil)
- **Testing**: Forge (unit, integration, fuzzing)
- **Libraries**: OpenZeppelin Contracts
- **Network**: Ethereum (Sepolia testnet → Mainnet)

### Frontend
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript 5.0+
- **Styling**: Tailwind CSS + shadcn/ui
- **Web3**: wagmi v2, viem, RainbowKit
- **State Management**: Zustand / React Context
- **Forms**: React Hook Form + Zod
- **API Client**: TanStack Query (React Query)
- **Animations**: Framer Motion
- **Icons**: Lucide React

### Backend
- **Runtime**: Node.js 20+ / Bun
- **Framework**: Express.js / tRPC
- **Language**: TypeScript
- **Database**: PostgreSQL + Prisma ORM
- **Cache**: Redis
- **Queue**: BullMQ / RabbitMQ
- **File Storage**: IPFS (Pinata)
- **Video**: Agora / Daily.co SDK

### DevOps & Infrastructure
- **Containerization**: Docker + Docker Compose
- **CI/CD**: GitHub Actions
- **Hosting**: 
  - Frontend: Vercel
  - Backend: Railway / Fly.io
  - Contracts: Ethereum Mainnet
- **Monitoring**: Sentry, LogRocket
- **Analytics**: PostHog / Mixpanel

---

## 📁 Project Structure

```
edutopia/
├── contracts/                      # Smart Contracts (Foundry)
│   ├── src/
│   │   ├── interfaces/            # Contract interfaces
│   │   ├── libraries/             # Shared logic (SessionLib, DisputeLib)
│   │   ├── core/                  # Main contracts
│   │   │   ├── SessionEscrow.sol
│   │   │   ├── TutorRegistry.sol
│   │   │   └── DisputeResolver.sol
│   │   ├── tokens/
│   │   │   └── CertificateNFT.sol
│   │   ├── utils/
│   │   │   ├── Errors.sol
│   │   │   └── Events.sol
│   │   └── PeerLearningHub.sol
│   ├── test/
│   │   ├── unit/
│   │   ├── integration/
│   │   └── fuzzing/
│   ├── script/
│   │   └── Deploy.s.sol
│   ├── foundry.toml
│   └── README.md
│
├── frontend/                       # Next.js Frontend
│   ├── src/
│   │   ├── app/                   # App router pages
│   │   ├── components/            # React components
│   │   ├── hooks/                 # Custom hooks
│   │   ├── lib/                   # Utilities, contracts, constants
│   │   ├── types/                 # TypeScript types
│   │   └── styles/
│   ├── public/
│   ├── package.json
│   └── README.md
│
├── backend/                        # Backend Services
│   ├── services/
│   │   ├── user-service/
│   │   ├── matching-service/
│   │   ├── booking-service/
│   │   ├── payment-service/
│   │   ├── contract-service/
│   │   ├── session-service/
│   │   ├── dispute-service/
│   │   ├── certificate-service/
│   │   ├── notification-service/
│   │   └── analytics-service/
│   ├── shared/                    # Shared utilities
│   ├── docker-compose.yml
│   └── README.md
│
├── docs/                          # Documentation
│   ├── architecture.md
│   ├── api-reference.md
│   ├── smart-contracts.md
│   └── deployment-guide.md
│
├── scripts/                       # Automation scripts
│   ├── deploy-contracts.sh
│   └── setup-dev.sh
│
├── .github/
│   └── workflows/                # CI/CD pipelines
│       ├── contracts-test.yml
│       ├── frontend-deploy.yml
│       └── backend-deploy.yml
│
├── .gitignore
├── LICENSE
└── README.md                      # This file
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:

- **Node.js** >= 20.0.0 ([Download](https://nodejs.org/))
- **Bun** (optional, faster alternative to npm) ([Install](https://bun.sh/))
- **Foundry** ([Install](https://book.getfoundry.sh/getting-started/installation))
- **Git** ([Download](https://git-scm.com/))
- **Docker** (for backend services) ([Download](https://www.docker.com/))
- **PostgreSQL** >= 14 (or use Docker)
- **Redis** (or use Docker)
- **MetaMask** or any Web3 wallet

### Clone the Repository

```bash
git clone https://github.com/yourusername/edutopia.git
cd edutopia
```

---

## 🔗 Smart Contracts Setup

### 1. Install Dependencies

```bash
cd contracts
forge install
```

### 2. Configure Environment

Create `.env` file in `contracts/` directory:

```bash
# Network RPC URLs
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
MAINNET_RPC_URL=https://mainnet.infura.io/v3/YOUR_INFURA_KEY

# Private Keys (NEVER commit these!)
DEPLOYER_PRIVATE_KEY=0x...
ADMIN_PRIVATE_KEY=0x...

# Etherscan API (for verification)
ETHERSCAN_API_KEY=your_etherscan_key

# Contract Addresses (after deployment)
TUTOR_REGISTRY_ADDRESS=0x...
SESSION_ESCROW_ADDRESS=0x...
DISPUTE_RESOLVER_ADDRESS=0x...
CERTIFICATE_NFT_ADDRESS=0x...
PEER_LEARNING_HUB_ADDRESS=0x...
```

### 3. Compile Contracts

```bash
forge build
```

### 4. Run Tests

```bash
# Unit tests
forge test

# With gas reports
forge test --gas-report

# Specific test file
forge test --match-path test/unit/SessionEscrow.t.sol

# Fuzzing tests
forge test --match-path test/fuzzing/

# Coverage
forge coverage
```

### 5. Deploy to Testnet (Sepolia)

```bash
# Deploy all contracts
forge script script/Deploy.s.sol --rpc-url $SEPOLIA_RPC_URL --broadcast --verify

# Deploy specific contract
forge create src/core/TutorRegistry.sol:TutorRegistry \
  --rpc-url $SEPOLIA_RPC_URL \
  --private-key $DEPLOYER_PRIVATE_KEY \
  --verify
```

### 6. Verify Contracts (if not auto-verified)

```bash
forge verify-contract <CONTRACT_ADDRESS> <CONTRACT_NAME> \
  --chain sepolia \
  --etherscan-api-key $ETHERSCAN_API_KEY
```

### 7. Interact with Contracts

```bash
# Read contract state
cast call <CONTRACT_ADDRESS> "isTutorRegistered(address)" <TUTOR_ADDRESS> --rpc-url $SEPOLIA_RPC_URL

# Write to contract
cast send <CONTRACT_ADDRESS> \
  "registerTutor(string[],uint256)" \
  '["Math","Physics"]' 1000000000000000000 \
  --rpc-url $SEPOLIA_RPC_URL \
  --private-key $DEPLOYER_PRIVATE_KEY
```

---

## 💻 Frontend Setup

### 1. Install Dependencies

```bash
cd frontend
npm install
# or
bun install
```

### 2. Configure Environment

Create `.env.local` file in `frontend/` directory:

```bash
# Blockchain Configuration
NEXT_PUBLIC_CHAIN_ID=11155111  # Sepolia testnet
NEXT_PUBLIC_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY

# Contract Addresses (from deployment)
NEXT_PUBLIC_TUTOR_REGISTRY_ADDRESS=0x...
NEXT_PUBLIC_SESSION_ESCROW_ADDRESS=0x...
NEXT_PUBLIC_DISPUTE_RESOLVER_ADDRESS=0x...
NEXT_PUBLIC_CERTIFICATE_NFT_ADDRESS=0x...
NEXT_PUBLIC_PEER_LEARNING_HUB_ADDRESS=0x...

# Backend API
NEXT_PUBLIC_API_URL=http://localhost:3001/api

# WalletConnect
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id

# IPFS
NEXT_PUBLIC_IPFS_GATEWAY=https://ipfs.io/ipfs/
NEXT_PUBLIC_PINATA_API_KEY=your_pinata_key
NEXT_PUBLIC_PINATA_SECRET_KEY=your_pinata_secret

# Optional: Analytics
NEXT_PUBLIC_POSTHOG_KEY=your_posthog_key
NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn
```

### 3. Run Development Server

```bash
npm run dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production

```bash
npm run build
npm run start
```

### 5. Run Tests

```bash
# Unit tests
npm run test

# E2E tests (Playwright)
npm run test:e2e

# Type checking
npm run type-check

# Linting
npm run lint
```

---

## 🖥️ Backend Setup

### 1. Install Dependencies

```bash
cd backend
npm install
# or
bun install
```

### 2. Configure Environment

Create `.env` file in `backend/` directory:

```bash
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/edutopia
REDIS_URL=redis://localhost:6379

# JWT Secret
JWT_SECRET=your_super_secure_secret_key

# Blockchain
ETHEREUM_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
CONTRACT_ADDRESSES='{"tutorRegistry":"0x...","sessionEscrow":"0x..."}'

# IPFS
PINATA_API_KEY=your_pinata_key
PINATA_SECRET_KEY=your_pinata_secret

# Video Service (Agora/Daily.co)
VIDEO_API_KEY=your_video_api_key
VIDEO_API_SECRET=your_video_secret

# Email (SendGrid/Mailgun)
SENDGRID_API_KEY=your_sendgrid_key
FROM_EMAIL=noreply@edutopia.xyz

# SMS (Twilio - optional)
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token

# Port
PORT=3001
```

### 3. Setup Database

```bash
# Run migrations
npx prisma migrate dev

# Seed database (optional)
npx prisma db seed
```

### 4. Start Services with Docker

```bash
# Start PostgreSQL, Redis, and all microservices
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### 5. Run Development Server (without Docker)

```bash
npm run dev
# or
bun dev
```

### 6. Run Tests

```bash
npm run test
```

---

## 📜 Smart Contracts

### Contract Addresses (Sepolia Testnet)

| Contract | Address |
|----------|---------|
| TutorRegistry | `0x...` |
| SessionEscrow | `0x...` |
| DisputeResolver | `0x...` |
| CertificateNFT | `0x...` |
| PeerLearningHub | `0x...` |

### Core Contracts

#### 1. **TutorRegistry.sol**
Manages tutor registration, profiles, and ratings.

**Key Functions:**
- `registerTutor(string[] subjects, uint256 hourlyRate)` - Register as a tutor
- `updateHourlyRate(uint256 newRate)` - Update teaching rate
- `rateTutor(address tutor, uint256 rating)` - Rate a tutor (1-5 stars)
- `getTutorProfile(address tutor)` - Get tutor information

#### 2. **SessionEscrow.sol**
Handles session creation, payment escrow, and completion.

**Key Functions:**
- `createSession(address tutor, uint256 duration, ...)` - Book and pay for session
- `completeSession(uint256 sessionId)` - Mark session complete
- `cancelSession(uint256 sessionId)` - Cancel before start
- `releasePayment(uint256 sessionId)` - Release funds to tutor after dispute window

#### 3. **DisputeResolver.sol**
Manages dispute creation and arbitration.

**Key Functions:**
- `raiseDispute(uint256 sessionId, string reason, string evidence)` - Raise a dispute
- `resolveDispute(uint256 disputeId, DisputeOutcome outcome)` - Arbiter resolves dispute
- `getDispute(uint256 disputeId)` - Get dispute details

#### 4. **CertificateNFT.sol**
ERC721 NFT for completion certificates.

**Key Functions:**
- `mintCertificate(address student, uint256 sessionId, ...)` - Mint certificate
- `getCertificate(uint256 tokenId)` - Get certificate metadata
- `tokenURI(uint256 tokenId)` - Get IPFS metadata URI

#### 5. **PeerLearningHub.sol**
Main orchestrator contract (optional hub pattern).

See [Smart Contracts Documentation](./docs/smart-contracts.md) for detailed API reference.

---

## 🧪 Testing

### Smart Contract Tests

```bash
cd contracts

# Run all tests
forge test

# Run with verbosity
forge test -vvv

# Gas report
forge test --gas-report

# Coverage report
forge coverage

# Specific test
forge test --match-test testSessionCreation
```

### Frontend Tests

```bash
cd frontend

# Unit tests (Jest + React Testing Library)
npm run test

# Watch mode
npm run test:watch

# Coverage
npm run test:coverage

# E2E tests (Playwright)
npm run test:e2e

# E2E UI mode
npm run test:e2e:ui
```

### Backend Tests

```bash
cd backend

# Run all tests
npm run test

# Watch mode
npm run test:watch

# Integration tests
npm run test:integration
```

---

## 🚢 Deployment

### Deploy Smart Contracts

```bash
cd contracts

# Deploy to Sepolia testnet
forge script script/Deploy.s.sol \
  --rpc-url $SEPOLIA_RPC_URL \
  --broadcast \
  --verify

# Deploy to Mainnet (CAUTION!)
forge script script/Deploy.s.sol \
  --rpc-url $MAINNET_RPC_URL \
  --broadcast \
  --verify \
  --slow  # Use this flag for mainnet
```

### Deploy Frontend (Vercel)

1. **Connect Repository** to Vercel
2. **Configure Environment Variables** in Vercel dashboard
3. **Deploy** - automatic on push to `main` branch

Or manually:

```bash
cd frontend

# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Deploy Backend (Railway / Fly.io)

**Using Railway:**

```bash
cd backend

# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Link project
railway link

# Deploy
railway up
```

**Using Fly.io:**

```bash
cd backend

# Install Fly CLI
curl -L https://fly.io/install.sh | sh

# Login
fly auth login

# Launch app
fly launch

# Deploy
fly deploy
```

### Environment Checklist

Before deploying to production:

- [ ] All smart contracts audited
- [ ] Contract addresses updated in frontend `.env`
- [ ] Database migrations run
- [ ] API keys configured (IPFS, video service, email)
- [ ] Domain configured with SSL
- [ ] Monitoring tools set up (Sentry, LogRocket)
- [ ] Analytics configured
- [ ] Rate limiting enabled
- [ ] Backup strategy in place

---

## 📖 Usage Guide

### For Students

1. **Connect Wallet** - Click "Connect Wallet" and approve connection
2. **Browse Tutors** - Search by subject or use filters
3. **Book Session** - Select tutor, choose date/time, pay with ETH
4. **Join Session** - Click "Join" when session starts
5. **Complete Session** - Click "Complete" after session ends
6. **Mint Certificate** - Optional: Mint NFT certificate to your wallet
7. **Rate Tutor** - Leave a rating and review

### For Tutors

1. **Connect Wallet** - Connect your wallet
2. **Register** - Fill out profile, subjects, and set hourly rate
3. **Set Availability** - Configure your schedule
4. **Accept Sessions** - Get notified when students book
5. **Teach** - Join session at scheduled time
6. **Get Paid** - Funds automatically released after 24-hour dispute window

### Platform Fees

- **Students**: No additional fees beyond gas
- **Tutors**: 2.5% platform fee deducted from earnings
- **Gas Costs**: User pays for their own transactions (register, book, dispute, etc.)

---

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

### Development Workflow

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** changes: `git commit -m 'Add amazing feature'`
4. **Push** to branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request

### Code Style

- **Solidity**: Follow [Solidity Style Guide](https://docs.soliditylang.org/en/latest/style-guide.html)
- **TypeScript**: Use ESLint + Prettier configuration
- **Commits**: Use [Conventional Commits](https://www.conventionalcommits.org/)

---

## 🔒 Security

### Reporting Vulnerabilities

If you discover a security vulnerability, please email **security@edutopia.xyz** instead of opening a public issue.

### Security Measures

- ✅ All contracts use OpenZeppelin audited libraries
- ✅ Comprehensive test coverage (unit, integration, fuzzing)
- ✅ ReentrancyGuard on all payment functions
- ✅ Access control with role-based permissions
- ✅ Time-locks on critical operations
- ✅ Emergency pause functionality
- ✅ Rate limiting on backend APIs
- ✅ Input validation and sanitization

### Audits

- [ ] **Smart Contracts**: Pending audit by [Audit Firm]
- [ ] **Backend Security**: Pending penetration testing

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](./LICENSE) file for details.

---

## 🙏 Acknowledgments

- **OpenZeppelin** - Secure smart contract libraries
- **Foundry** - Blazing fast smart contract development
- **Next.js** - Amazing React framework
- **wagmi** - Best React hooks for Ethereum
- **shadcn/ui** - Beautiful component library
- **Ethereum Foundation** - For building the future of decentralized apps

---

## 📞 Contact & Community

- **Website**: [https://edutopia.xyz](https://edutopia.xyz)
- **Twitter**: [@EdutopiaXYZ](https://twitter.com/EdutopiaXYZ)
- **Discord**: [Join our community](https://discord.gg/edutopia)
- **Email**: hello@edutopia.xyz
- **Docs**: [https://docs.edutopia.xyz](https://docs.edutopia.xyz)

---

## 🗺️ Roadmap

### Phase 1: MVP (Q1 2024) ✅
- [x] Core smart contracts
- [x] Basic frontend (student + tutor flows)
- [x] Escrow and payment system
- [x] NFT certificates

### Phase 2: Beta Launch (Q2 2024)
- [ ] Dispute resolution with arbiters
- [ ] Video conferencing integration
- [ ] Mobile responsive design
- [ ] Testnet deployment
- [ ] Private beta with 50 tutors

### Phase 3: Public Launch (Q3 2024)
- [ ] Security audit completion
- [ ] Mainnet deployment
- [ ] Marketing campaign
- [ ] Mobile app (iOS + Android)
- [ ] Multi-language support

### Phase 4: Scale (Q4 2024)
- [ ] DAO governance for arbitration
- [ ] Staking for tutors (reputation)
- [ ] Referral rewards program
- [ ] Integration with universities
- [ ] AI-powered tutor matching

### Future Features
- [ ] Group sessions (1-to-many)
- [ ] Recorded sessions marketplace
- [ ] Subscription model for regular students
- [ ] Multi-chain deployment (Polygon, Arbitrum)
- [ ] Tutor certification programs

---

## 📊 Stats (Live)

- **Total Sessions**: Coming soon
- **Active Tutors**: Coming soon
- **Certificates Issued**: Coming soon
- **Total Value Locked**: Coming soon

---

<div align="center">

**Built with ❤️ by the Edutopia Team**

[Website](https://edutopia.xyz) • [Documentation](https://docs.edutopia.xyz) • [Twitter](https://twitter.com/EdutopiaXYZ) • [Discord](https://discord.gg/edutopia)

</div>
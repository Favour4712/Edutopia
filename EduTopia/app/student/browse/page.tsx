"use client"

import { useState } from "react"
import { SUBJECTS } from "@/lib/constants"
import { TutorCard } from "@/components/tutor/tutor-card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Search, Filter } from "lucide-react"

// Mock mentor data
const MOCK_TUTORS = [
  {
    id: "1",
    name: "Amina Farooq",
    subjects: ["Smart Contract Development", "DeFi Strategy", "Smart Contract Auditing"],
    hourlyRate: 0.55,
    rating: 4.9,
    ratingCount: 212,
    totalSessions: 468,
    bio: "Lead auditor at Cypher Labs focused on EVM security and on-chain governance.",
    avatar: "/female-tutor-profile.jpg",
  },
  {
    id: "2",
    name: "Marco Alvarez",
    subjects: ["Rust for Solana", "Validator Operations", "Cross-Chain Bridges"],
    hourlyRate: 0.45,
    rating: 4.8,
    ratingCount: 164,
    totalSessions: 329,
    bio: "Runs a multi-chain validator set and mentors teams shipping performant Solana programs.",
    avatar: "/male-chemistry-tutor.jpg",
  },
  {
    id: "3",
    name: "Linh Tran",
    subjects: ["Zero-Knowledge Proofs", "Layer 2 Scaling", "Privacy Protocols"],
    hourlyRate: 0.6,
    rating: 4.85,
    ratingCount: 191,
    totalSessions: 402,
    bio: "Protocol engineer pushing zkEVM research into production rollups and privacy-preserving apps.",
    avatar: "/female-language-tutor.jpg",
  },
  {
    id: "4",
    name: "Elliot Brooks",
    subjects: ["Web3 Frontend", "Crypto Community Management", "NFT Product Design"],
    hourlyRate: 0.38,
    rating: 4.7,
    ratingCount: 138,
    totalSessions: 287,
    bio: "Shipped multiple NFT drops and community growth playbooks for top Web3 brands.",
    avatar: "/male-tutor-profile.jpg",
  },
]

export default function BrowseTutorsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null)
  const [priceRange, setPriceRange] = useState([0, 1])
  const [minRating, setMinRating] = useState(4)
  const [showFilters, setShowFilters] = useState(false)

  const filteredTutors = MOCK_TUTORS.filter((tutor) => {
    const matchesSearch =
      tutor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tutor.subjects.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesSubject = !selectedSubject || tutor.subjects.includes(selectedSubject)

    const matchesPrice =
      Number.parseFloat(tutor.hourlyRate.toFixed(2)) >= priceRange[0] &&
      Number.parseFloat(tutor.hourlyRate.toFixed(2)) <= priceRange[1]

    const matchesRating = tutor.rating >= minRating

    return matchesSearch && matchesSubject && matchesPrice && matchesRating
  })

  return (
    <div className="w-full">
      <div className="border-b border-border p-6">
        <h1 className="mb-4 text-3xl font-bold">Find Web3 Mentors</h1>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
            <Input
              placeholder="Search by protocol, skill, or mentor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="lg:hidden">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex">
        <div
          className={`${showFilters ? "block" : "hidden"} lg:block w-64 space-y-6 border-r border-border p-6 max-h-[calc(100vh-120px)] overflow-y-auto`}
        >
          <div>
            <h3 className="mb-3 font-semibold">Subject</h3>
            <div className="max-h-48 space-y-2 overflow-y-auto">
              {SUBJECTS.map((subject) => (
                <label key={subject} className="flex cursor-pointer items-center gap-2">
                  <input
                    type="radio"
                    name="subject"
                    value={subject}
                    checked={selectedSubject === subject}
                    onChange={(e) => setSelectedSubject(e.target.checked ? subject : null)}
                    className="h-4 w-4"
                  />
                  <span className="text-sm">{subject}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-3 font-semibold">Hourly Rate (ETH)</h3>
            <Slider value={priceRange} onValueChange={setPriceRange} min={0} max={1} step={0.05} className="mb-2" />
            <div className="text-sm text-muted-foreground">
              {priceRange[0].toFixed(2)} - {priceRange[1].toFixed(2)} ETH
            </div>
          </div>

          <div>
            <h3 className="mb-3 font-semibold">Minimum Rating</h3>
            <div className="flex gap-2">
              {[4, 4.5, 4.7, 5].map((rating) => (
                <button
                  key={rating}
                  onClick={() => setMinRating(rating)}
                  className={`rounded px-3 py-2 text-sm font-medium transition-colors ${
                    minRating === rating
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted hover:bg-muted/80"
                  }`}
                >
                  {rating}+
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex-1 p-6">
          {filteredTutors.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredTutors.map((tutor) => (
                <TutorCard key={tutor.id} tutor={tutor} />
              ))}
            </div>
          ) : (
            <div className="py-12 text-center">
              <p className="mb-4 text-muted-foreground">No mentors found matching your filters</p>
              <Button
                onClick={() => {
                  setSearchQuery("")
                  setSelectedSubject(null)
                  setPriceRange([0, 1])
                  setMinRating(4)
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

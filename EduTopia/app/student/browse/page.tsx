"use client";

import { useMemo, useState } from "react";
import { SUBJECTS } from "@/lib/constants";
import { TutorCard } from "@/components/tutor/tutor-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Search, Filter, Sparkles, Users2, Wallet, Star } from "lucide-react";
import { useTutorDirectory } from "@/lib/web3/hooks";
import { truncateHash } from "@/lib/web3/utils";

const FALLBACK_AVATARS = [
  "/female-tutor-profile.jpg",
  "/male-tutor-profile.jpg",
  "/female-language-tutor.jpg",
  "/male-chemistry-tutor.jpg",
];

const normalizeToken = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/(ment|ing|er|ed|s)$/g, "")
    .trim();

export default function BrowseTutorsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState([0, 250]);
  const [minRating, setMinRating] = useState(4);
  const [showFilters, setShowFilters] = useState(false);

  const tutorDirectory = useTutorDirectory();
  const fetchError = tutorDirectory.error;

  const tutors = useMemo(() => {
    if (tutorDirectory.isLoading || !tutorDirectory.tutors) {
      return [];
    }

    return tutorDirectory.tutors.map((entry, index) => ({
      data: entry,
      name: truncateHash(entry.address, 4),
      bio: "On-chain mentor available for Web3 tutoring sessions. Connect and learn directly from practitioners.",
      avatar: FALLBACK_AVATARS[index % FALLBACK_AVATARS.length],
    }));
  }, [tutorDirectory]);

  const queryTokens = useMemo(
    () => searchQuery.split(/\s+/).map(normalizeToken).filter(Boolean),
    [searchQuery]
  );

  const filteredTutors = tutors.filter((tutor) => {
    const tutorName = tutor.name.toLowerCase();
    const tutorAddress = tutor.data.address.toLowerCase();
    const subjectsLower = tutor.data.subjects.map((subject) =>
      subject.toLowerCase()
    );
    const subjectTokens = tutor.data.subjects.flatMap((subject) =>
      subject.split(/\s+/).map(normalizeToken).filter(Boolean)
    );

    const matchesSearch =
      queryTokens.length === 0 ||
      queryTokens.every((token) => {
        if (tutorName.includes(token) || tutorAddress.includes(token)) {
          return true;
        }

        return (
          subjectsLower.some((subject) => subject.includes(token)) ||
          subjectTokens.some((subjectToken) => {
            if (!subjectToken) return false;
            return subjectToken.includes(token) || token.includes(subjectToken);
          })
        );
      });

    const matchesSubject =
      !selectedSubject || tutor.data.subjects.includes(selectedSubject);

    const matchesPrice =
      Number.parseFloat(tutor.data.hourlyRate.toFixed(2)) >= priceRange[0] &&
      Number.parseFloat(tutor.data.hourlyRate.toFixed(2)) <= priceRange[1];

    const matchesRating =
      tutor.data.averageRating >= minRating || tutor.data.ratingCount === 0;

    return matchesSearch && matchesSubject && matchesPrice && matchesRating;
  });

  const noExactMatches =
    filteredTutors.length === 0 && tutors.length > 0 && queryTokens.length > 0;

  return (
    <div className="min-h-screen w-full bg-background">
      <div className="relative overflow-hidden border-b border-border bg-linear-to-br from-primary/10 via-background to-background">
        <div className="absolute inset-0 bg-grid-[rgba(0,0,0,0.05)] dark:bg-grid-[rgba(255,255,255,0.06)] [mask-image:radial-gradient(ellipse_at_top, rgba(0,0,0,0.6), transparent_70%)]" />
        <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-12 lg:flex-row lg:items-center">
          <div className="flex-1 space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-muted px-4 py-1 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
              <Sparkles className="h-4 w-4" />
              curated mentors
            </span>
            <div>
              <h1 className="text-4xl font-black tracking-tight text-foreground sm:text-5xl">
                Find a Web3 mentor that matches your learning goals.
              </h1>
              <p className="mt-4 max-w-xl text-base text-muted-foreground">
                Browse verified tutors, review on-chain performance, and book
                sessions using secure USDC escrow on Base Sepolia.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 text-foreground sm:grid-cols-4">
              <div className="rounded-lg border border-border bg-muted px-4 py-3">
                <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground">
                  <Users2 className="h-4 w-4" />
                  mentors
                </div>
                <p className="mt-1 text-2xl font-semibold">
                  {tutors.length.toString().padStart(2, "0")}
                </p>
              </div>
              <div className="rounded-lg border border-border bg-muted px-4 py-3">
                <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground">
                  <Wallet className="h-4 w-4" />
                  stablecoin
                </div>
                <p className="mt-1 text-2xl font-semibold">USDC escrow</p>
              </div>
              <div className="rounded-lg border border-border bg-muted px-4 py-3">
                <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground">
                  <Star className="h-4 w-4" />
                  rating
                </div>
                <p className="mt-1 text-2xl font-semibold">
                  {minRating.toFixed(1)}+
                </p>
              </div>
              <div className="rounded-lg border border-border bg-muted px-4 py-3">
                <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground">
                  <Search className="h-4 w-4" />
                  subjects
                </div>
                <p className="mt-1 text-2xl font-semibold">{SUBJECTS.length}</p>
              </div>
            </div>
            <div className="relative flex items-center gap-3 rounded-xl border border-border bg-muted p-1 pr-3 text-foreground">
              <Search className="ml-3 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search by protocol, skill, or mentor wallet…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border-0 bg-transparent text-base text-foreground placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
              />
              <Button
                variant="ghost"
                className="hidden gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground hover:text-foreground lg:flex"
                onClick={() => setShowFilters((prev) => !prev)}
              >
                <Filter className="h-4 w-4" />
                Filters
              </Button>
            </div>
          </div>
          <div className="flex h-full w-full max-w-sm flex-col gap-4 rounded-2xl border border-border bg-muted p-6 text-foreground shadow-xl backdrop-blur">
            <h2 className="text-lg font-semibold">Quick filters</h2>
            <p className="text-sm text-muted-foreground">
              Narrow the mentor list with curated subjects, price bands, and
              rating history. Changes apply instantly.
            </p>
            <div className="hidden lg:block space-y-6">
              <div>
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  Subject
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {SUBJECTS.slice(0, 8).map((subject) => (
                    <button
                      key={subject}
                      onClick={() =>
                        setSelectedSubject((current) =>
                          current === subject ? null : subject
                        )
                      }
                      className={`rounded-lg border px-3 py-2 text-xs font-medium transition ${
                        selectedSubject === subject
                          ? "border-secondary bg-secondary text-secondary-foreground"
                          : "border-border bg-background/80 text-muted-foreground hover:border-muted hover:text-foreground"
                      }`}
                    >
                      {subject}
                    </button>
                  ))}
                  <button
                    onClick={() => setSelectedSubject(null)}
                    className="col-span-2 rounded-lg border border-dashed border-border px-3 py-2 text-xs font-medium text-muted-foreground transition hover:border-muted hover:text-foreground"
                  >
                    Clear subject
                  </button>
                </div>
              </div>
              <div>
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  Hourly Rate (USDC)
                </h3>
                <Slider
                  value={priceRange}
                  onValueChange={setPriceRange}
                  min={0}
                  max={500}
                  step={10}
                  className="mb-3"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{priceRange[0].toFixed(0)} USDC</span>
                  <span>{priceRange[1].toFixed(0)} USDC</span>
                </div>
              </div>
              <div>
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  Minimum Rating
                </h3>
                <div className="flex flex-wrap gap-2">
                  {[4, 4.5, 4.7, 5].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => setMinRating(rating)}
                      className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                        minRating === rating
                          ? "bg-secondary text-secondary-foreground"
                          : "bg-background/80 text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      {rating}★
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <Button
              variant="secondary"
              className="mt-auto w-full text-xs uppercase tracking-[0.2em]"
              onClick={() => {
                setSearchQuery("");
                setSelectedSubject(null);
                setPriceRange([0, 250]);
                setMinRating(4);
              }}
            >
              Reset filters
            </Button>
          </div>
        </div>
      </div>

      <div className="relative mx-auto w-full max-w-6xl px-6 py-12">
        <div className="mb-6 flex items-center justify-between text-foreground">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
              Available mentors
            </p>
            <h2 className="mt-1 text-2xl font-semibold">
              {filteredTutors.length > 0
                ? "Handpicked experts ready to teach"
                : "No perfect match? Explore everyone"}
            </h2>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="gap-2 border-border text-muted-foreground hover:text-foreground lg:hidden"
            onClick={() => setShowFilters((prev) => !prev)}
          >
            <Filter className="h-4 w-4" />
            Filters
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <div
            className={`space-y-6 rounded-2xl border border-border bg-muted p-6 text-foreground shadow-lg backdrop-blur lg:sticky lg:top-24 ${
              showFilters ? "block" : "hidden"
            } lg:block`}
          >
            <div>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Subject
              </h3>
              <div className="max-h-60 space-y-2 overflow-y-auto pr-1">
                {SUBJECTS.map((subject) => (
                  <label
                    key={subject}
                    className={`flex cursor-pointer items-center justify-between rounded-lg border px-3 py-2 text-sm transition ${
                      selectedSubject === subject
                        ? "border-secondary bg-secondary text-secondary-foreground"
                        : "border-border bg-background/80 text-muted-foreground hover:border-muted hover:text-foreground"
                    }`}
                  >
                    <span>{subject}</span>
                    <input
                      type="radio"
                      name="subject"
                      value={subject}
                      checked={selectedSubject === subject}
                      onChange={(e) =>
                        setSelectedSubject(e.target.checked ? subject : null)
                      }
                      className="h-4 w-4 accent-secondary"
                    />
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Hourly Rate (USDC)
              </h3>
              <Slider
                value={priceRange}
                onValueChange={setPriceRange}
                min={0}
                max={500}
                step={10}
                className="mb-3"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{priceRange[0].toFixed(0)} USDC</span>
                <span>{priceRange[1].toFixed(0)} USDC</span>
              </div>
            </div>

            <div>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Minimum Rating
              </h3>
              <div className="flex flex-wrap gap-2">
                {[4, 4.5, 4.7, 5].map((rating) => (
                  <button
                    key={rating}
                    onClick={() => setMinRating(rating)}
                    className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                      minRating === rating
                        ? "bg-secondary text-secondary-foreground"
                        : "bg-background/80 text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    {rating}★
                  </button>
                ))}
              </div>
            </div>

            <Button
              variant="ghost"
              className="w-full border border-border bg-transparent text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground"
              onClick={() => {
                setSearchQuery("");
                setSelectedSubject(null);
                setPriceRange([0, 250]);
                setMinRating(4);
              }}
            >
              Clear filters
            </Button>
          </div>

          <div>
            {fetchError ? (
              <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-8 text-center text-destructive">
                <p className="text-sm font-semibold">Unable to load mentors</p>
                <p className="mt-2 text-sm">Details: {fetchError.message}</p>
              </div>
            ) : tutorDirectory.isLoading ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-64 animate-pulse rounded-2xl border border-border bg-muted"
                  />
                ))}
              </div>
            ) : filteredTutors.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {filteredTutors.map((tutor) => (
                  <TutorCard key={tutor.data.address} tutor={tutor} />
                ))}
              </div>
            ) : noExactMatches ? (
              <div className="space-y-6">
                <div className="rounded-2xl border border-primary/30 bg-primary/10 p-6 text-foreground backdrop-blur">
                  <p className="font-semibold">
                    No exact matches for “{searchQuery}”. Showing all mentors
                    instead.
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Adjust filters or reset your search to discover more
                    experts.
                  </p>
                </div>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {tutors.map((tutor) => (
                    <TutorCard key={tutor.data.address} tutor={tutor} />
                  ))}
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-border bg-muted p-8 text-center text-muted-foreground">
                <p className="text-lg font-semibold">No mentors found</p>
                <p className="mt-2 text-sm">
                  Try broadening your search or clearing the filters to view all
                  available tutors.
                </p>
                <Button
                  className="mt-6"
                  variant="secondary"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedSubject(null);
                    setPriceRange([0, 250]);
                    setMinRating(4);
                  }}
                >
                  Reset filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

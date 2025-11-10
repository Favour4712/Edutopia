"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { SUBJECTS } from "@/lib/constants";
import {
  CheckCircle2,
  Zap,
  Code2,
  Shield,
  Coins,
  Users,
  Blocks,
  Lock,
  Sparkles,
  Rocket,
  Brain,
  Globe,
} from "lucide-react";
import { UsdcBalanceCard } from "@/components/web3/usdc-balance-card";
import { BaseError } from "viem";
import { useToast } from "@/hooks/use-toast";
import { useRegisterTutor, useTutorProfile } from "@/lib/web3/hooks";
import { truncateHash } from "@/lib/web3/utils";

const registerTutorSchema = z.object({
  hourlyRate: z
    .number({ invalid_type_error: "Enter a valid number" })
    .min(10, "Rate must be at least 10 USDC")
    .max(1000, "Rate cannot exceed 1,000 USDC"),
  bio: z.string().min(10, "Bio must be at least 10 characters"),
});

type RegisterTutorFormData = z.infer<typeof registerTutorSchema>;

// Subject icon mapping for visual enhancement
const subjectIcons: Record<string, any> = {
  "Smart Contract Development": Code2,
  "Solidity Fundamentals": Code2,
  "Rust for Solana": Code2,
  "Move Language on Sui": Code2,
  "Zero-Knowledge Proofs": Lock,
  "Layer 2 Scaling": Blocks,
  "DeFi Strategy": Coins,
  Tokenomics: Coins,
  "DAO Governance": Users,
  "Blockchain Security": Shield,
  "Smart Contract Auditing": Shield,
  "MEV Research": Brain,
  "Cross-Chain Bridges": Globe,
  "NFT Product Design": Sparkles,
  "Web3 Frontend": Code2,
  "Crypto Community Management": Users,
  "Validator Operations": Blocks,
  "Privacy Protocols": Lock,
  "Crypto Legal & Compliance": Shield,
  "GameFi Design": Rocket,
};

// Subject color mapping for visual variety
const subjectColors: Record<string, string> = {
  "Smart Contract Development":
    "from-blue-500/20 to-cyan-500/20 border-blue-500/30",
  "Solidity Fundamentals":
    "from-purple-500/20 to-pink-500/20 border-purple-500/30",
  "Rust for Solana": "from-orange-500/20 to-red-500/20 border-orange-500/30",
  "Move Language on Sui":
    "from-teal-500/20 to-emerald-500/20 border-teal-500/30",
  "Zero-Knowledge Proofs":
    "from-violet-500/20 to-purple-500/20 border-violet-500/30",
  "Layer 2 Scaling": "from-indigo-500/20 to-blue-500/20 border-indigo-500/30",
  "DeFi Strategy": "from-green-500/20 to-emerald-500/20 border-green-500/30",
  Tokenomics: "from-yellow-500/20 to-amber-500/20 border-yellow-500/30",
  "DAO Governance": "from-pink-500/20 to-rose-500/20 border-pink-500/30",
  "Blockchain Security": "from-red-500/20 to-orange-500/20 border-red-500/30",
  "Smart Contract Auditing":
    "from-amber-500/20 to-yellow-500/20 border-amber-500/30",
  "MEV Research": "from-fuchsia-500/20 to-purple-500/20 border-fuchsia-500/30",
  "Cross-Chain Bridges": "from-cyan-500/20 to-blue-500/20 border-cyan-500/30",
  "NFT Product Design": "from-rose-500/20 to-pink-500/20 border-rose-500/30",
  "Web3 Frontend": "from-sky-500/20 to-blue-500/20 border-sky-500/30",
  "Crypto Community Management":
    "from-lime-500/20 to-green-500/20 border-lime-500/30",
  "Validator Operations":
    "from-slate-500/20 to-gray-500/20 border-slate-500/30",
  "Privacy Protocols":
    "from-indigo-500/20 to-violet-500/20 border-indigo-500/30",
  "Crypto Legal & Compliance":
    "from-emerald-500/20 to-teal-500/20 border-emerald-500/30",
  "GameFi Design": "from-orange-500/20 to-amber-500/20 border-orange-500/30",
};

export default function RegisterTutorPage() {
  const [step, setStep] = useState(1);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<RegisterTutorFormData>({
    resolver: zodResolver(registerTutorSchema),
    defaultValues: {
      hourlyRate: 50,
      bio: "",
    },
  });

  const { toast } = useToast();
  const profile = useTutorProfile();
  const {
    registerTutor,
    transactionHash,
    isSubmitting: txIsSubmitting,
    isConfirming: txIsConfirming,
    isConfirmed: txIsConfirmed,
    error: txError,
    reset: resetRegisterTutor,
  } = useRegisterTutor();

  const registrationComplete = profile.isRegistered || txIsConfirmed;
  const isSubmitting = txIsSubmitting || txIsConfirming;

  const hourlyRate = watch("hourlyRate");

  const subjectsKey = useMemo(
    () => profile.subjects.join("|"),
    [profile.subjects]
  );
  const subjectsToDisplay = profile.isRegistered
    ? profile.subjects
    : selectedSubjects;
  const hourlyRateDisplay = profile.isRegistered
    ? profile.hourlyRate
    : hourlyRate;

  useEffect(() => {
    if (profile.isRegistered) {
      setSelectedSubjects(profile.subjects);
      if (profile.hourlyRate > 0) {
        setValue("hourlyRate", profile.hourlyRate);
      }
    }
  }, [profile.isRegistered, profile.hourlyRate, subjectsKey, setValue]);

  const profileRefetch = profile.query.refetch;

  useEffect(() => {
    if (txIsConfirmed) {
      toast({
        title: "Tutor profile confirmed",
        description: transactionHash
          ? `Hash ${truncateHash(transactionHash)}`
          : "Your on-chain tutor profile is now live.",
      });
      profileRefetch?.();
      resetRegisterTutor();
    }
  }, [
    txIsConfirmed,
    transactionHash,
    profileRefetch,
    toast,
    resetRegisterTutor,
  ]);

  useEffect(() => {
    if (txError) {
      toast({
        title: "Registration failed",
        description: txError.message,
        variant: "destructive",
      });
      resetRegisterTutor();
    }
  }, [txError, toast, resetRegisterTutor]);

  const handleSubjectToggle = (subject: string) => {
    setSelectedSubjects((prev) =>
      prev.includes(subject)
        ? prev.filter((s) => s !== subject)
        : [...prev, subject]
    );
  };

  const onSubmit = async (data: RegisterTutorFormData) => {
    if (selectedSubjects.length === 0) {
      setStep(1);
      toast({
        title: "Select at least one subject",
        description: "Choose the topics you want to teach before continuing.",
        variant: "destructive",
      });
      return;
    }

    try {
      const hash = await registerTutor(selectedSubjects, data.hourlyRate);

      toast({
        title: "Transaction submitted",
        description: `Hash ${truncateHash(hash)}`,
      });
    } catch (error) {
      const description =
        error instanceof BaseError
          ? error.shortMessage
          : error instanceof Error
          ? error.message
          : "Something went wrong";

      toast({
        title: "Registration failed",
        description,
        variant: "destructive",
      });
    }
  };

  if (registrationComplete) {
    return (
      <div className="flex flex-1 flex-col px-4 py-12">
        <div className="container mx-auto max-w-2xl space-y-8">
          <UsdcBalanceCard />

          <Card className="space-y-6 border border-success/30 bg-success/10 p-8 text-center shadow-lg">
            <div className="flex justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-success/20">
                <CheckCircle2 className="h-12 w-12 text-success" />
              </div>
            </div>
            <div className="space-y-3">
              <h1 className="text-3xl font-bold">Tutor profile live</h1>
              <p className="text-muted-foreground">
                You&apos;re ready to accept on-chain bookings and get paid in
                mUSDC.
              </p>
            </div>

            <div className="grid gap-6 text-left sm:grid-cols-2">
              <div>
                <p className="text-xs uppercase text-muted-foreground">
                  Subjects
                </p>
                <ul className="mt-2 space-y-1 text-sm">
                  {subjectsToDisplay.map((subject) => (
                    <li key={subject} className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-success" />
                      {subject}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-xs uppercase text-muted-foreground">
                  Hourly rate
                </p>
                <p className="mt-2 text-2xl font-semibold">
                  {hourlyRateDisplay.toFixed(2)} mUSDC
                </p>
                <p className="text-xs text-muted-foreground">
                  Students will deposit this amount into escrow per hour.
                </p>
              </div>
            </div>

            {transactionHash && (
              <p className="text-xs text-muted-foreground">
                Latest transaction: {truncateHash(transactionHash)}
              </p>
            )}

            <div className="space-y-2">
              <Button asChild className="w-full bg-secondary">
                <Link href="/tutor">Go to Dashboard</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/tutor/profile">Edit Profile</Link>
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col px-4 py-12">
      <div className="container mx-auto max-w-2xl">
        <UsdcBalanceCard />
        {/* Progress Indicator */}
        <div className="mb-12">
          <div className="flex gap-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-2 flex-1 rounded-full transition-colors ${
                  step >= s ? "bg-secondary" : "bg-muted"
                }`}
              />
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Step 1: Subjects */}
          {step === 1 && (
            <div className="space-y-8">
              <div className="text-center">
                <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-linear-to-br from-primary to-secondary">
                  <Brain className="h-8 w-8 text-white" />
                </div>
                <h1 className="mb-2 text-4xl font-bold">
                  Choose Your Expertise
                </h1>
                <p className="text-lg text-muted-foreground">
                  Select all blockchain domains you can mentor in
                </p>
              </div>

              <Card className="border-2 border-primary/20 bg-linear-to-br from-primary/5 to-secondary/5 p-6">
                <div className="mb-4 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <p className="text-sm font-medium">
                    {selectedSubjects.length} topic
                    {selectedSubjects.length !== 1 ? "s" : ""} selected
                  </p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {SUBJECTS.map((subject) => {
                    const Icon = subjectIcons[subject] || Code2;
                    const colorClass =
                      subjectColors[subject] ||
                      "from-gray-500/20 to-slate-500/20 border-gray-500/30";
                    const isSelected = selectedSubjects.includes(subject);

                    return (
                      <button
                        key={subject}
                        type="button"
                        onClick={() => handleSubjectToggle(subject)}
                        className={`group relative overflow-hidden rounded-xl border-2 p-4 text-left transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                          isSelected
                            ? `bg-linear-to-br ${colorClass} border-secondary shadow-md`
                            : "border-border bg-card hover:border-primary/30"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`rounded-lg p-2 transition-colors ${
                              isSelected
                                ? "bg-secondary/20"
                                : "bg-muted group-hover:bg-primary/10"
                            }`}
                          >
                            <Icon
                              className={`h-5 w-5 ${
                                isSelected
                                  ? "text-secondary"
                                  : "text-muted-foreground group-hover:text-primary"
                              }`}
                            />
                          </div>
                          <div className="flex-1">
                            <p
                              className={`text-sm font-semibold leading-tight ${
                                isSelected ? "text-secondary" : ""
                              }`}
                            >
                              {subject}
                            </p>
                          </div>
                          {isSelected && (
                            <CheckCircle2 className="h-5 w-5 shrink-0 text-secondary" />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </Card>

              {errors.subjects && (
                <p className="text-center text-sm text-destructive">
                  {errors.subjects.message}
                </p>
              )}

              <Button
                type="button"
                onClick={() => setStep(2)}
                disabled={selectedSubjects.length === 0}
                className="w-full bg-secondary py-6 text-lg font-semibold shadow-lg transition-all hover:shadow-xl"
              >
                Continue to Pricing
                <Zap className="ml-2 h-5 w-5" />
              </Button>
            </div>
          )}

          {/* Step 2: Pricing */}
          {step === 2 && (
            <div className="space-y-8">
              <div className="text-center">
                <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-linear-to-br from-green-500 to-emerald-500">
                  <Coins className="h-8 w-8 text-white" />
                </div>
                <h1 className="mb-2 text-4xl font-bold">Set Your Rate</h1>
                <p className="text-lg text-muted-foreground">
                  Define your hourly earnings in mUSDC (Base Sepolia USDC)
                </p>
              </div>

              <Card className="border-2 border-green-500/20 bg-linear-to-br from-green-500/5 to-emerald-500/5 p-8">
                <label className="mb-4 block text-center text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  Hourly Rate
                </label>
                <div className="mb-6 flex items-center justify-center gap-4">
                  <div className="relative flex-1 max-w-xs">
                    <Input
                      type="number"
                      step="0.5"
                      min="10"
                      {...register("hourlyRate", { valueAsNumber: true })}
                      className="h-16 border-2 pr-16 text-center text-2xl font-bold"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-lg font-semibold text-muted-foreground">
                      mUSDC
                    </span>
                  </div>
                </div>

                <div className="rounded-xl bg-card p-6 text-center shadow-inner">
                  <p className="mb-2 text-sm text-muted-foreground">
                    Students will pay
                  </p>
                  <p className="text-4xl font-bold text-green-600 dark:text-green-400">
                    {hourlyRate.toFixed(2)} mUSDC
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Stable-value token with 6 decimal precision.
                  </p>
                </div>

                {errors.hourlyRate && (
                  <p className="mt-4 text-center text-sm text-destructive">
                    {errors.hourlyRate.message}
                  </p>
                )}
              </Card>

              <Card className="border border-amber-500/30 bg-amber-500/5 p-4">
                <div className="flex gap-3">
                  <Sparkles className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
                  <div className="text-sm text-muted-foreground">
                    <p className="font-medium text-foreground">Why mUSDC?</p>
                    <p className="mt-1">
                      Using a stable asset keeps payouts predictable for you and
                      your learners while we&apos;re testing on Base Sepolia.
                    </p>
                  </div>
                </div>
              </Card>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="flex-1 py-6"
                >
                  Back
                </Button>
                <Button
                  type="button"
                  onClick={() => setStep(3)}
                  className="flex-1 bg-secondary py-6 text-lg font-semibold shadow-lg transition-all hover:shadow-xl"
                >
                  Continue to Bio
                  <Zap className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Bio */}
          {step === 3 && (
            <div className="space-y-8">
              <div className="text-center">
                <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-linear-to-br from-purple-500 to-pink-500">
                  <Rocket className="h-8 w-8 text-white" />
                </div>
                <h1 className="mb-2 text-4xl font-bold">Your Story</h1>
                <p className="text-lg text-muted-foreground">
                  Share your experience and teaching approach
                </p>
              </div>

              <Card className="border-2 border-purple-500/20 bg-linear-to-br from-purple-500/5 to-pink-500/5 p-6">
                <label className="mb-3 block text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  Professional Bio
                </label>
                <Textarea
                  {...register("bio")}
                  placeholder="e.g., Protocol engineer with 5+ years shipping DeFi primitives. Led audits for $2B+ TVL protocols. Passionate about mentoring the next wave of Web3 builders..."
                  rows={8}
                  className="resize-none border-2 text-base leading-relaxed"
                />
                {errors.bio && (
                  <p className="mt-2 text-sm text-destructive">
                    {errors.bio.message}
                  </p>
                )}
                <p className="mt-3 text-xs text-muted-foreground">
                  💡 Tip: Mention your background, notable projects, and what
                  learners can expect from your sessions.
                </p>
              </Card>

              <Card className="border-2 border-secondary/30 bg-linear-to-br from-secondary/10 to-accent/10 p-6">
                <div className="flex gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-secondary/20">
                    <Zap className="h-6 w-6 text-secondary" />
                  </div>
                  <div>
                    <p className="mb-1 text-lg font-bold">
                      Ready to go on-chain?
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Your profile will be published to the blockchain. Once
                      confirmed, learners can discover and book sessions with
                      you.
                    </p>
                  </div>
                </div>
              </Card>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(2)}
                  className="flex-1 py-6"
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-linear-to-r from-secondary to-accent py-6 text-lg font-bold shadow-xl transition-all hover:shadow-2xl disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Publishing...
                    </>
                  ) : (
                    <>
                      <Rocket className="mr-2 h-5 w-5" />
                      Register on Blockchain
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { SUBJECTS } from "@/lib/constants"
import { Save } from "lucide-react"

const profileSchema = z.object({
  bio: z.string().min(10),
  hourlyRate: z.number().min(0.1),
})

type ProfileFormData = z.infer<typeof profileSchema>

export default function TutorProfilePage() {
  const [selectedSubjects, setSelectedSubjects] = useState([
    "Smart Contract Development",
    "Smart Contract Auditing",
  ])
  const [isSaving, setIsSaving] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      bio: "Protocol engineer specializing in EVM audits, threat modeling, and secure smart contract delivery.",
      hourlyRate: 0.55,
    },
  })

  const handleSubjectToggle = (subject: string) => {
    setSelectedSubjects((prev) => (prev.includes(subject) ? prev.filter((s) => s !== subject) : [...prev, subject]))
  }

  const onSubmit = async (data: ProfileFormData) => {
    setIsSaving(true)
    try {
      console.log("Updating profile:", { ...data, subjects: selectedSubjects })
      // TODO: Update on blockchain
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="w-full p-6">
      <h1 className="text-3xl font-bold mb-6">Your Profile</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl space-y-6">
        {/* Bio */}
        <Card className="p-6">
          <h2 className="font-bold text-lg mb-4">About You</h2>
          <Textarea {...register("bio")} rows={4} className="resize-none" />
          {errors.bio && <p className="text-sm text-destructive mt-1">{errors.bio.message}</p>}
        </Card>

        {/* Subjects */}
        <Card className="p-6">
          <h2 className="font-bold text-lg mb-4">Subjects You Teach</h2>
          <div className="grid grid-cols-2 gap-3">
            {SUBJECTS.map((subject) => (
              <button
                key={subject}
                type="button"
                onClick={() => handleSubjectToggle(subject)}
                className={`p-4 rounded-lg border-2 transition-all text-left font-medium ${
                  selectedSubjects.includes(subject)
                    ? "border-secondary bg-secondary/10"
                    : "border-border hover:border-secondary/50"
                }`}
              >
                {subject}
              </button>
            ))}
          </div>
        </Card>

        {/* Hourly Rate */}
        <Card className="p-6">
          <h2 className="font-bold text-lg mb-4">Pricing</h2>
          <div>
            <label className="block text-sm font-medium mb-2">Hourly Rate (ETH)</label>
            <Input type="number" step="0.05" min="0.1" {...register("hourlyRate", { valueAsNumber: true })} />
            {errors.hourlyRate && <p className="text-sm text-destructive mt-1">{errors.hourlyRate.message}</p>}
          </div>
        </Card>

        {/* Actions */}
        <div className="flex gap-3">
          <Button variant="outline" asChild className="flex-1 bg-transparent">
            <a href="/tutor">Cancel</a>
          </Button>
          <Button type="submit" disabled={isSaving} className="flex-1 bg-secondary">
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  )
}

"use client"

import { create } from "zustand"

interface Rating {
  sessionId: string
  rating: number
  feedback: string
}

interface RatingStore {
  ratings: Rating[]
  addRating: (rating: Rating) => void
  getRating: (sessionId: string) => Rating | undefined
}

export const useRatingStore = create<RatingStore>((set, get) => ({
  ratings: [],
  addRating: (rating) =>
    set((state) => ({
      ratings: [...state.ratings.filter((r) => r.sessionId !== rating.sessionId), rating],
    })),
  getRating: (sessionId) => get().ratings.find((r) => r.sessionId === sessionId),
}))

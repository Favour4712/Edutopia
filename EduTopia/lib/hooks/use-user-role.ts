"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { UserRole } from "@/lib/types"

interface UserRoleStore {
  role: UserRole
  setRole: (role: UserRole) => void
  isLoading: boolean
}

export const useUserRoleStore = create<UserRoleStore>()(
  persist(
    (set) => ({
      role: null,
      setRole: (role) => set({ role }),
      isLoading: false,
    }),
    {
      name: "user-role-storage",
    },
  ),
)

export function useUserRole() {
  const { role, setRole } = useUserRoleStore()
  return { role, setRole }
}

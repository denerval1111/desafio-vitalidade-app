import { useState } from 'react'
import {
  createDefaultUserData,
  deriveStats,
  getAchievements,
  getLocalDateKey,
  getLongTermGoals,
  normalizeGoal,
  normalizeVitalityData,
  saveCheckinForDate,
} from '../lib/vitality.js'

const STORAGE_KEY = 'vitality_user_data'

function readStoredData() {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    return stored ? normalizeVitalityData(JSON.parse(stored)) : createDefaultUserData()
  } catch {
    return createDefaultUserData()
  }
}

export function useVitalityData() {
  const [userData, setUserData] = useState(readStoredData)

  const persist = (updater) => {
    setUserData((currentData) => {
      const nextData = typeof updater === 'function' ? updater(currentData) : updater
      const normalized = normalizeVitalityData(nextData)
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized))
      return normalized
    })
  }

  const completeOnboarding = (profile) => {
    persist((previous) => ({
      ...previous,
      profile,
      hasCompletedOnboarding: true,
      startDate: previous.startDate || new Date().toISOString(),
    }))
  }

  const saveCheckin = (date, checkinData) => {
    const existing = Boolean(userData.dailyProgress?.[date])
    const updated = saveCheckinForDate(userData, date, checkinData)
    const points = updated.dailyProgress[date].points
    persist(updated)
    return { points, edited: existing }
  }

  const addCustomGoal = (goal) => {
    const normalizedGoal = normalizeGoal(goal)
    if (!normalizedGoal) return false

    persist((previous) => ({
      ...previous,
      longTermData: {
        ...previous.longTermData,
        customGoals: [...previous.longTermData.customGoals, normalizedGoal],
      },
    }))
    return true
  }

  const resetData = () => persist(createDefaultUserData())

  const importData = (rawData) => {
    const imported = normalizeVitalityData(rawData)
    persist(imported)
  }

  return {
    userData,
    completeOnboarding,
    saveCheckin,
    addCustomGoal,
    resetData,
    importData,
    stats: deriveStats(userData, getLocalDateKey()),
    achievements: getAchievements(userData),
    longTermGoals: getLongTermGoals(userData),
  }
}

import { useState } from 'react'
import {
  createDefaultUserData,
  deriveStats,
  getAchievements,
  getCheckinFeedback,
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
    const updated = saveCheckinForDate(userData, date, checkinData)
    const feedback = getCheckinFeedback(userData, updated, date)
    const points = updated.dailyProgress[date].points
    const edited = Boolean(userData.dailyProgress?.[date])
    persist(updated)
    return { points, edited, feedback }
  }

  const saveWeeklyReview = (reviewKey, review) => {
    if (!reviewKey) return
    persist((previous) => ({
      ...previous,
      weeklyReviews: {
        ...previous.weeklyReviews,
        [reviewKey]: {
          answer: typeof review?.answer === 'string' ? review.answer.trim() : '',
          focus: typeof review?.focus === 'string' ? review.focus.trim() : '',
          dismissed: Boolean(review?.dismissed),
          updatedAt: new Date().toISOString(),
        },
      },
    }))
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
    saveWeeklyReview,
    addCustomGoal,
    resetData,
    importData,
    stats: deriveStats(userData, getLocalDateKey()),
    achievements: getAchievements(userData),
    longTermGoals: getLongTermGoals(userData),
  }
}

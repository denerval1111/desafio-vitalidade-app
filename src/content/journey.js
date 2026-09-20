import weekTwoSource from '@/content/weekTwo.json'
import weekThreeSource from '@/content/weekThree.json'
import weekFourSource from '@/content/weekFour.json'
import { closingDays } from '@/content/closingDays.js'
import { weekOne } from '@/content/weekOne.js'

function adaptSourceWeek(source) {
  return {
    id: source.id,
    title: source.title,
    subtitle: source.subtitle,
    safetyNote: source.responsibleUse,
    days: source.days.map((day) => ({
      day: day.day,
      title: day.title,
      focus: day.theme,
      morning: [day.morning],
      micro: day.throughoutDay,
      evening: [day.evening],
      reflection: day.reflection,
    })),
  }
}

export const journeyStages = [
  weekOne,
  adaptSourceWeek(weekTwoSource),
  adaptSourceWeek(weekThreeSource),
  adaptSourceWeek(weekFourSource),
  closingDays,
]

export const JOURNEY_LENGTH = 30

export function getStageForDay(dayNumber) {
  const day = Math.min(JOURNEY_LENGTH, Math.max(1, Number(dayNumber) || 1))
  return journeyStages.find((stage) => stage.days.some((item) => item.day === day)) || journeyStages[0]
}

export function getJourneyDay(totalRegisteredDays) {
  return (Math.max(0, Number(totalRegisteredDays) || 0) % JOURNEY_LENGTH) + 1
}

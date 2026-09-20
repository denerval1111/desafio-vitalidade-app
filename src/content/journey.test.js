import { describe, expect, it } from 'vitest'
import { getJourneyDay, getStageForDay, journeyStages } from './journey.js'

describe('jornada prática de 30 dias', () => {
  it('oferece todos os dias de 1 a 30 sem repetições', () => {
    const days = journeyStages.flatMap((stage) => stage.days.map((day) => day.day))

    expect(days).toHaveLength(30)
    expect([...new Set(days)]).toEqual(Array.from({ length: 30 }, (_, index) => index + 1))
  })

  it('mantém práticas e reflexão em cada dia', () => {
    const days = journeyStages.flatMap((stage) => stage.days)

    days.forEach((day) => {
      expect(day.morning.length).toBeGreaterThan(0)
      expect(day.micro.length).toBeGreaterThan(0)
      expect(day.evening.length).toBeGreaterThan(0)
      expect(day.reflection).not.toHaveLength(0)
    })
  })

  it('calcula o próximo dia dentro de cada ciclo de 30 registros', () => {
    expect(getJourneyDay(0)).toBe(1)
    expect(getJourneyDay(29)).toBe(30)
    expect(getJourneyDay(30)).toBe(1)
    expect(getJourneyDay(59)).toBe(30)
    expect(getStageForDay(30).title).toContain('Fechamento')
  })
})

import { describe, expect, it } from 'vitest'
import {
  calculateCheckinPoints,
  createDefaultUserData,
  createEmptyCheckin,
  deriveStats,
  getLongTermGoals,
  saveCheckinForDate,
} from './vitality.js'

describe('regras de check-in', () => {
  it('não concede pontos somente por humor', () => {
    const checkin = createEmptyCheckin()
    checkin.psiquiatria.humor = 5
    expect(calculateCheckinPoints(checkin)).toBe(0)
  })

  it('substitui o registro da mesma data sem duplicar dias ou pontos', () => {
    const first = createEmptyCheckin()
    first.nutrologia.refeicao = true
    const second = createEmptyCheckin()
    second.nutrologia.exercicio = true
    second.nutrologia.refeicao = true

    const oneCheckin = saveCheckinForDate(createDefaultUserData(), '2026-09-20', first)
    const edited = saveCheckinForDate(oneCheckin, '2026-09-20', second)
    const stats = deriveStats(edited, '2026-09-20')

    expect(stats.totalDays).toBe(1)
    expect(stats.totalPoints).toBe(20)
    expect(edited.dailyProgress['2026-09-20'].points).toBe(20)
  })

  it('calcula sequência a partir de datas reais e não de cliques', () => {
    const checkin = createEmptyCheckin()
    checkin.medicinaRegenerativa.hidratacao = true
    let data = saveCheckinForDate(createDefaultUserData(), '2026-09-18', checkin)
    data = saveCheckinForDate(data, '2026-09-19', checkin)
    data = saveCheckinForDate(data, '2026-09-20', checkin)

    expect(deriveStats(data, '2026-09-20').streak).toBe(3)
    expect(deriveStats(data, '2026-09-21').streak).toBe(0)
  })
})

describe('metas', () => {
  it('não conclui uma meta de peso apenas pela passagem do prazo', () => {
    const goal = {
      id: 'peso',
      title: 'Chegar a 70 kg',
      type: 'result',
      targetDays: 30,
      initialValue: 80,
      targetValue: 70,
      createdAt: '2026-08-01T12:00:00.000Z',
    }
    let data = createDefaultUserData()
    data.longTermData.customGoals = [goal]
    for (let day = 1; day <= 30; day += 1) {
      data = saveCheckinForDate(data, `2026-08-${String(day).padStart(2, '0')}`, createEmptyCheckin())
    }

    const resultGoal = getLongTermGoals(data).custom[0]
    expect(resultGoal.completed).toBe(false)
    expect(resultGoal.progress).toBe(0)
  })
})

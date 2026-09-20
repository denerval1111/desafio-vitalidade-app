import { describe, expect, it } from 'vitest'
import {
  calculateCheckinPoints,
  createDefaultUserData,
  createEmptyCheckin,
  deriveStats,
  getCheckinFeedback,
  getLongTermGoals,
  saveCheckinForDate,
} from './vitality.js'

function checkinWithPractice(group, field) {
  const checkin = createEmptyCheckin()
  checkin[group][field] = true
  return checkin
}

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
    const checkin = checkinWithPractice('medicinaRegenerativa', 'hidratacao')
    let data = saveCheckinForDate(createDefaultUserData(), '2026-09-18', checkin)
    data = saveCheckinForDate(data, '2026-09-19', checkin)
    data = saveCheckinForDate(data, '2026-09-20', checkin)

    expect(deriveStats(data, '2026-09-20').streak).toBe(3)
    expect(deriveStats(data, '2026-09-21').streak).toBe(0)
  })
})

describe('métricas de progresso', () => {
  it('calcula ritmo recente, melhor sequência e calendário do ciclo', () => {
    let data = createDefaultUserData()
    const dates = ['2026-09-14', '2026-09-15', '2026-09-16', '2026-09-17', '2026-09-18', '2026-09-19', '2026-09-20']
    dates.forEach((date, index) => {
      const practice = index % 2 === 0
        ? checkinWithPractice('psiquiatria', 'meditacao')
        : checkinWithPractice('nutrologia', 'refeicao')
      data = saveCheckinForDate(data, date, practice)
    })

    const stats = deriveStats(data, '2026-09-20')
    expect(stats.recentDays).toBe(7)
    expect(stats.streak).toBe(7)
    expect(stats.longestStreak).toBe(7)
    expect(stats.currentCycleSlots.filter((slot) => slot.checkin)).toHaveLength(7)
    expect(stats.reviewPrompt?.week).toBe(1)
    expect(stats.topPillar?.key).toBe('psiquiatria')
  })

  it('não oferece novamente uma revisão semanal que foi salva ou dispensada', () => {
    let data = createDefaultUserData()
    for (let day = 14; day <= 20; day += 1) {
      data = saveCheckinForDate(data, `2026-09-${day}`, checkinWithPractice('medicinaRegenerativa', 'sono'))
    }
    data.weeklyReviews = {
      'cycle-1-week-1': { answer: 'Dormir melhor ajudou.', focus: 'Manter a rotina noturna.', dismissed: false },
    }

    expect(deriveStats(data, '2026-09-20').reviewPrompt).toBeNull()
  })

  it('acolhe a retomada após uma pausa sem tratar como falha', () => {
    const initial = saveCheckinForDate(createDefaultUserData(), '2026-09-14', checkinWithPractice('nutrologia', 'refeicao'))
    const updated = saveCheckinForDate(initial, '2026-09-20', checkinWithPractice('psiquiatria', 'gratidao'))

    expect(getCheckinFeedback(initial, updated, '2026-09-20').title).toBe('Que bom ter você de volta')
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

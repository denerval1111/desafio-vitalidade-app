export const VITALITY_DATA_VERSION = 3
export const CYCLE_LENGTH = 30

export const PILLAR_META = {
  medicinaRegenerativa: { label: 'Medicina Regenerativa', shortLabel: 'Recuperação' },
  nutrologia: { label: 'Nutrologia', shortLabel: 'Alimentação e movimento' },
  psiquiatria: { label: 'Saúde Mental', shortLabel: 'Saúde mental' },
  gerenciamentoPeso: { label: 'Gerenciamento do Peso', shortLabel: 'Gerenciamento do peso' },
}

export const EMPTY_CHECKIN = {
  medicinaRegenerativa: {
    jejum: false,
    sono: false,
    hidratacao: false,
  },
  nutrologia: {
    refeicao: false,
    suplementos: false,
    exercicio: false,
  },
  psiquiatria: {
    meditacao: false,
    gratidao: false,
    humor: null,
  },
  gerenciamentoPeso: {
    pesagem: false,
    controleAlimentar: false,
    pesoKg: '',
  },
  notas: '',
}

export function getLocalDateKey(date = new Date()) {
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60_000)
  return localDate.toISOString().slice(0, 10)
}

export function isDateKey(value) {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)
}

export function addDays(dateKey, days) {
  const date = new Date(`${dateKey}T12:00:00`)
  date.setDate(date.getDate() + days)
  return getLocalDateKey(date)
}

export function createDefaultUserData() {
  return {
    dataVersion: VITALITY_DATA_VERSION,
    profile: {
      name: '',
      age: '',
      objectives: [],
    },
    dailyProgress: {},
    weeklyReviews: {},
    hasCompletedOnboarding: false,
    startDate: null,
    longTermData: {
      customGoals: [],
    },
  }
}

export function createEmptyCheckin() {
  return JSON.parse(JSON.stringify(EMPTY_CHECKIN))
}

export function normalizeCheckin(checkin = {}) {
  const empty = createEmptyCheckin()
  const numberValue = Number(checkin?.gerenciamentoPeso?.pesoKg)

  return {
    medicinaRegenerativa: {
      ...empty.medicinaRegenerativa,
      ...checkin.medicinaRegenerativa,
    },
    nutrologia: {
      ...empty.nutrologia,
      ...checkin.nutrologia,
    },
    psiquiatria: {
      ...empty.psiquiatria,
      ...checkin.psiquiatria,
      humor: [1, 2, 3, 4, 5].includes(checkin?.psiquiatria?.humor)
        ? checkin.psiquiatria.humor
        : null,
    },
    gerenciamentoPeso: {
      ...empty.gerenciamentoPeso,
      ...checkin.gerenciamentoPeso,
      pesoKg: Number.isFinite(numberValue) && numberValue > 0 ? numberValue : '',
    },
    notas: typeof checkin.notas === 'string' ? checkin.notas : '',
  }
}

export function calculateCheckinPoints(checkin) {
  const data = normalizeCheckin(checkin)
  let points = 0

  Object.values(data.medicinaRegenerativa).forEach((value) => {
    if (value === true) points += 10
  })
  Object.values(data.nutrologia).forEach((value) => {
    if (value === true) points += 10
  })
  if (data.psiquiatria.meditacao) points += 10
  if (data.psiquiatria.gratidao) points += 10
  if (data.gerenciamentoPeso.pesagem) points += 10
  if (data.gerenciamentoPeso.controleAlimentar) points += 10

  return points
}

function legacyDateFor(day, startDate) {
  const baseDate = isDateKey(startDate?.slice?.(0, 10))
    ? startDate.slice(0, 10)
    : getLocalDateKey()
  return addDays(baseDate, Math.max(0, Number(day) - 1))
}

function normalizeWeeklyReviews(reviews) {
  if (!reviews || typeof reviews !== 'object') return {}

  return Object.fromEntries(Object.entries(reviews)
    .filter(([key]) => /^cycle-\d+-week-[1-4]$/.test(key))
    .map(([key, review]) => [key, {
      answer: typeof review?.answer === 'string' ? review.answer : '',
      focus: typeof review?.focus === 'string' ? review.focus : '',
      dismissed: Boolean(review?.dismissed),
      updatedAt: typeof review?.updatedAt === 'string' ? review.updatedAt : null,
    }]))
}

export function normalizeVitalityData(rawData) {
  const defaults = createDefaultUserData()
  const source = rawData && typeof rawData === 'object' ? rawData : defaults
  const legacyProgress = source.dailyProgress && typeof source.dailyProgress === 'object'
    ? source.dailyProgress
    : {}
  const dailyProgress = {}

  Object.entries(legacyProgress).forEach(([key, value]) => {
    const date = isDateKey(key)
      ? key
      : legacyDateFor(key, source.startDate)
    const checkin = normalizeCheckin(value)
    dailyProgress[date] = {
      ...checkin,
      date,
      points: calculateCheckinPoints(checkin),
      updatedAt: value?.updatedAt || value?.date || new Date().toISOString(),
    }
  })

  const customGoals = Array.isArray(source?.longTermData?.customGoals)
    ? source.longTermData.customGoals.map(normalizeGoal).filter(Boolean)
    : []

  return {
    ...defaults,
    ...source,
    dataVersion: VITALITY_DATA_VERSION,
    profile: {
      ...defaults.profile,
      ...source.profile,
      objectives: Array.isArray(source?.profile?.objectives) ? source.profile.objectives : [],
    },
    dailyProgress,
    weeklyReviews: normalizeWeeklyReviews(source.weeklyReviews),
    longTermData: {
      customGoals,
    },
  }
}

export function createCheckinRecord(date, checkin) {
  if (!isDateKey(date)) throw new Error('Data de check-in inválida.')
  const normalized = normalizeCheckin(checkin)
  return {
    ...normalized,
    date,
    points: calculateCheckinPoints(normalized),
    updatedAt: new Date().toISOString(),
  }
}

export function saveCheckinForDate(userData, date, checkin) {
  const data = normalizeVitalityData(userData)
  return {
    ...data,
    dailyProgress: {
      ...data.dailyProgress,
      [date]: createCheckinRecord(date, checkin),
    },
  }
}

export function sortedCheckins(userData) {
  const data = normalizeVitalityData(userData)
  return Object.entries(data.dailyProgress)
    .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
    .map(([date, checkin]) => ({ date, ...checkin }))
}

export function calculateStreak(checkins, today = getLocalDateKey()) {
  const completedDates = new Set(checkins.map((checkin) => checkin.date))
  let cursor = today
  let streak = 0

  while (completedDates.has(cursor)) {
    streak += 1
    cursor = addDays(cursor, -1)
  }

  return streak
}

export function calculateLongestStreak(checkins) {
  if (!checkins.length) return 0
  const dates = [...new Set(checkins.map((checkin) => checkin.date))].sort()
  let longest = 1
  let current = 1

  for (let index = 1; index < dates.length; index += 1) {
    current = dates[index] === addDays(dates[index - 1], 1) ? current + 1 : 1
    longest = Math.max(longest, current)
  }

  return longest
}

function pillarPractices(checkin, pillar) {
  if (pillar === 'medicinaRegenerativa') {
    return [checkin.medicinaRegenerativa.jejum, checkin.medicinaRegenerativa.sono, checkin.medicinaRegenerativa.hidratacao]
  }
  if (pillar === 'nutrologia') {
    return [checkin.nutrologia.refeicao, checkin.nutrologia.suplementos, checkin.nutrologia.exercicio]
  }
  if (pillar === 'psiquiatria') {
    return [checkin.psiquiatria.meditacao, checkin.psiquiatria.gratidao]
  }
  return [checkin.gerenciamentoPeso.pesagem, checkin.gerenciamentoPeso.controleAlimentar]
}

function pillarScore(checkin, pillar) {
  const practices = pillarPractices(checkin, pillar)
  return practices.filter(Boolean).length / practices.length
}

function calculatePillarDetails(checkins) {
  const pillarKeys = Object.keys(PILLAR_META)
  const totalRecords = checkins.length

  return Object.fromEntries(pillarKeys.map((pillar) => {
    const practiceCount = checkins.reduce((sum, checkin) => sum + pillarPractices(checkin, pillar).filter(Boolean).length, 0)
    const activeDays = checkins.filter((checkin) => pillarPractices(checkin, pillar).some(Boolean)).length
    const average = totalRecords
      ? checkins.reduce((sum, checkin) => sum + pillarScore(checkin, pillar), 0) / totalRecords
      : 0

    return [pillar, {
      ...PILLAR_META[pillar],
      activeDays,
      practiceCount,
      presencePercentage: totalRecords ? Math.round((activeDays / totalRecords) * 100) : 0,
      practiceProgress: Math.round(average * 100),
    }]
  }))
}

function getTopPillar(pillarDetails) {
  const values = Object.entries(pillarDetails)
  const [key, detail] = values.reduce((best, current) => {
    const [, bestDetail] = best
    const [, currentDetail] = current
    if (currentDetail.activeDays > bestDetail.activeDays) return current
    if (currentDetail.activeDays === bestDetail.activeDays && currentDetail.practiceCount > bestDetail.practiceCount) return current
    return best
  }, values[0] || [null, { activeDays: 0, practiceCount: 0 }])

  return detail?.activeDays > 0 ? { key, ...detail } : null
}

function createCycleSlots(checkins) {
  return Array.from({ length: CYCLE_LENGTH }, (_, index) => {
    const checkin = checkins[index] || null
    return {
      slot: index + 1,
      checkin,
      date: checkin?.date || null,
      points: Number(checkin?.points) || 0,
    }
  })
}

function buildWeeklySummaries(checkins) {
  return Array.from({ length: 4 }, (_, index) => {
    const week = index + 1
    const records = checkins.slice(index * 7, (index + 1) * 7)
    const pillarDetails = calculatePillarDetails(records)
    return {
      week,
      label: `Semana ${week}`,
      range: `Dias ${index * 7 + 1}–${index * 7 + 7}`,
      registeredDays: records.length,
      points: records.reduce((sum, checkin) => sum + (Number(checkin.points) || 0), 0),
      topPillar: getTopPillar(pillarDetails),
      checkins: records,
    }
  })
}

function buildCycleHistory(checkins) {
  const cycles = []
  for (let start = 0; start < checkins.length; start += CYCLE_LENGTH) {
    const records = checkins.slice(start, start + CYCLE_LENGTH)
    const pillarDetails = calculatePillarDetails(records)
    cycles.push({
      cycle: Math.floor(start / CYCLE_LENGTH) + 1,
      records,
      registeredDays: records.length,
      points: records.reduce((sum, checkin) => sum + (Number(checkin.points) || 0), 0),
      startDate: records[0]?.date || null,
      endDate: records.at(-1)?.date || null,
      completed: records.length === CYCLE_LENGTH,
      topPillar: getTopPillar(pillarDetails),
    })
  }
  return cycles.reverse()
}

function reviewPrompt(userData, totalDays, daysInCurrentCycle, completedCycles, activeCycleCheckins, cycleHistory) {
  if (!totalDays) return null

  const lastCycle = cycleHistory.at(-1)
  const reviewCycleNumber = daysInCurrentCycle > 0 ? completedCycles + 1 : completedCycles
  const reviewCheckins = daysInCurrentCycle > 0 ? activeCycleCheckins : lastCycle?.records || []
  const availableWeeks = Math.min(4, Math.floor(reviewCheckins.length / 7))

  for (let week = 1; week <= availableWeeks; week += 1) {
    const key = `cycle-${reviewCycleNumber}-week-${week}`
    if (!userData?.weeklyReviews?.[key]) {
      const summary = buildWeeklySummaries(reviewCheckins).find((item) => item.week === week)
      return { key, cycle: reviewCycleNumber, ...summary }
    }
  }

  return null
}

export function deriveStats(userData, today = getLocalDateKey()) {
  const checkins = sortedCheckins(userData)
  const totalDays = checkins.length
  const totalPoints = checkins.reduce((sum, checkin) => sum + (Number(checkin.points) || 0), 0)
  const completedCycles = Math.floor(totalDays / CYCLE_LENGTH)
  const daysInCurrentCycle = totalDays % CYCLE_LENGTH
  const currentCycle = completedCycles + 1
  const activeCycleCheckins = daysInCurrentCycle ? checkins.slice(totalDays - daysInCurrentCycle) : []
  const cycleHistory = buildCycleHistory(checkins)
  const currentPillarDetails = calculatePillarDetails(activeCycleCheckins)
  const recentCheckins = checkins.filter((checkin) => checkin.date >= addDays(today, -6) && checkin.date <= today)
  const currentCycleSlots = createCycleSlots(activeCycleCheckins)
  const weeklySummaries = buildWeeklySummaries(activeCycleCheckins)

  return {
    totalDays,
    totalPoints,
    completedCycles,
    currentCycle,
    daysInCurrentCycle,
    nextDayInCycle: daysInCurrentCycle + 1,
    progressPercentage: Math.round((daysInCurrentCycle / CYCLE_LENGTH) * 100),
    streak: calculateStreak(checkins, today),
    longestStreak: calculateLongestStreak(checkins),
    recentDays: recentCheckins.length,
    hasCheckinToday: Boolean(userData?.dailyProgress?.[today]),
    todayCheckin: userData?.dailyProgress?.[today] || null,
    pilarProgress: Object.fromEntries(Object.entries(currentPillarDetails).map(([key, detail]) => [key, detail.practiceProgress])),
    pillarDetails: currentPillarDetails,
    topPillar: getTopPillar(currentPillarDetails),
    currentCycleCheckins: activeCycleCheckins,
    currentCycleSlots,
    weeklySummaries,
    cycleHistory,
    reviewPrompt: reviewPrompt(userData, totalDays, daysInCurrentCycle, completedCycles, activeCycleCheckins, cycleHistory),
  }
}

export function getCheckinFeedback(previousData, updatedData, date) {
  const edited = Boolean(previousData?.dailyProgress?.[date])
  const previousCheckins = sortedCheckins(previousData).filter((checkin) => checkin.date < date)
  const stats = deriveStats(updatedData, date)
  const previousDate = previousCheckins.at(-1)?.date || null
  const dayGap = previousDate ? Math.round((new Date(`${date}T12:00:00`) - new Date(`${previousDate}T12:00:00`)) / 86_400_000) : 0

  if (edited) {
    return {
      title: 'Check-in atualizado',
      message: `Seu registro de hoje agora soma ${stats.todayCheckin?.points || 0} pontos.`,
    }
  }
  if (stats.totalDays === 1) {
    return {
      title: 'Seu primeiro passo já conta',
      message: 'Você começou a construir a sua jornada. Escolha o possível e siga no seu ritmo.',
    }
  }
  if (stats.totalDays % CYCLE_LENGTH === 0) {
    return {
      title: 'Um ciclo foi concluído',
      message: `Você registrou ${CYCLE_LENGTH} dias neste ciclo. Reserve um momento para reconhecer o que deseja levar adiante.`,
    }
  }
  if (dayGap >= 4) {
    return {
      title: 'Que bom ter você de volta',
      message: 'Retomar também é parte da jornada. O registro de hoje já reabre espaço para o cuidado.',
    }
  }
  if ([7, 14, 21, 28].includes(stats.daysInCurrentCycle)) {
    return {
      title: `Semana ${Math.ceil(stats.daysInCurrentCycle / 7)} construída`,
      message: `Você já registrou ${stats.daysInCurrentCycle} dias neste ciclo. Se quiser, faça uma reflexão breve sobre esta etapa.`,
    }
  }
  if (stats.streak >= 3) {
    return {
      title: 'Ritmo possível em construção',
      message: `Você registrou ${stats.streak} dias consecutivos. A consistência nasce de escolhas pequenas e repetidas.`,
    }
  }
  return {
    title: 'Check-in salvo',
    message: `${stats.todayCheckin?.points || 0} pontos registrados hoje. Cada prática possível ajuda a construir continuidade.`,
  }
}

export function normalizeGoal(goal) {
  if (!goal || typeof goal !== 'object' || !goal.title?.trim()) return null
  const type = goal.type === 'result' ? 'result' : 'habit'
  const targetDays = Math.max(1, Number(goal.targetDays) || CYCLE_LENGTH)

  return {
    id: goal.id || `goal_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    title: goal.title.trim(),
    description: typeof goal.description === 'string' ? goal.description : '',
    type,
    targetDays,
    metric: type === 'result' ? 'weight' : null,
    initialValue: type === 'result' ? Number(goal.initialValue) || null : null,
    targetValue: type === 'result' ? Number(goal.targetValue) || null : null,
    createdAt: goal.createdAt || new Date().toISOString(),
  }
}

function latestWeight(checkins) {
  const weightedCheckins = checkins
    .filter((checkin) => Number(checkin.gerenciamentoPeso?.pesoKg) > 0)
  return weightedCheckins.length
    ? Number(weightedCheckins.at(-1).gerenciamentoPeso.pesoKg)
    : null
}

function goalResultStatus(goal, checkins) {
  const currentValue = latestWeight(checkins) ?? goal.initialValue
  const { initialValue, targetValue } = goal
  const targetIsValid = Number.isFinite(targetValue) && Number.isFinite(initialValue)
  const decreasing = targetIsValid && targetValue < initialValue
  const completed = targetIsValid && Number.isFinite(currentValue)
    ? decreasing ? currentValue <= targetValue : currentValue >= targetValue
    : false
  const distance = targetIsValid ? Math.abs(targetValue - initialValue) : 0
  const covered = targetIsValid && Number.isFinite(currentValue)
    ? Math.abs(currentValue - initialValue)
    : 0
  const progress = distance > 0 ? Math.max(0, Math.min(100, Math.round((covered / distance) * 100))) : 0

  return {
    ...goal,
    currentValue,
    completed,
    progress: completed ? 100 : progress,
    remainingValue: targetIsValid && Number.isFinite(currentValue) ? Math.abs(currentValue - targetValue) : null,
    unit: 'kg',
  }
}

export function getLongTermGoals(userData) {
  const stats = deriveStats(userData)
  const checkins = sortedCheckins(userData)
  const predefined = [30, 90, 180, 360].map((targetDays) => ({
    id: `goal_${targetDays}`,
    title: `${targetDays} dias de consistência`,
    targetDays,
    type: 'habit',
    progress: Math.min(100, Math.round((stats.totalDays / targetDays) * 100)),
    completed: stats.totalDays >= targetDays,
    remainingDays: Math.max(0, targetDays - stats.totalDays),
  }))
  const custom = (userData?.longTermData?.customGoals || []).map((goal) => {
    if (goal.type === 'result') return goalResultStatus(goal, checkins)
    const startDate = isDateKey(goal.createdAt?.slice?.(0, 10))
      ? goal.createdAt.slice(0, 10)
      : null
    const registeredDays = startDate
      ? checkins.filter((checkin) => checkin.date >= startDate).length
      : 0
    return {
      ...goal,
      progress: Math.min(100, Math.round((registeredDays / goal.targetDays) * 100)),
      completed: registeredDays >= goal.targetDays,
      remainingDays: Math.max(0, goal.targetDays - registeredDays),
    }
  })

  return { predefined, custom }
}

export function getAchievements(userData) {
  const stats = deriveStats(userData)
  return [
    { id: 'first_day', name: 'Primeiro passo', description: 'Seu primeiro registro já conta.', earned: stats.totalDays >= 1 },
    { id: 'three_days', name: 'Ritmo possível', description: 'Registre três dias no ciclo.', earned: stats.daysInCurrentCycle >= 3 || stats.totalDays >= 3 },
    { id: 'week_built', name: 'Semana construída', description: 'Registre sete dias em um ciclo.', earned: stats.totalDays >= 7 },
    { id: 'return', name: 'Retomada consciente', description: 'Voltar também faz parte da jornada.', earned: stats.totalDays >= 2 },
    { id: 'balanced', name: 'Equilíbrio em construção', description: 'Registre ao menos uma prática em cada pilar.', earned: Object.values(stats.pillarDetails).every((detail) => detail.activeDays > 0) },
    { id: 'cycle_complete', name: 'Ciclo concluído', description: 'Complete 30 registros na jornada.', earned: stats.completedCycles >= 1 },
  ]
}

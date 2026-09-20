export const VITALITY_DATA_VERSION = 2

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

function pillarScore(checkin, pillar) {
  if (pillar === 'medicinaRegenerativa') {
    return [checkin.medicinaRegenerativa.jejum, checkin.medicinaRegenerativa.sono, checkin.medicinaRegenerativa.hidratacao]
      .filter(Boolean).length / 3
  }
  if (pillar === 'nutrologia') {
    return [checkin.nutrologia.refeicao, checkin.nutrologia.suplementos, checkin.nutrologia.exercicio]
      .filter(Boolean).length / 3
  }
  if (pillar === 'psiquiatria') {
    return [checkin.psiquiatria.meditacao, checkin.psiquiatria.gratidao]
      .filter(Boolean).length / 2
  }
  return [checkin.gerenciamentoPeso.pesagem, checkin.gerenciamentoPeso.controleAlimentar]
    .filter(Boolean).length / 2
}

function calculatePillarProgress(checkins) {
  const pillars = ['medicinaRegenerativa', 'nutrologia', 'psiquiatria', 'gerenciamentoPeso']
  if (!checkins.length) return Object.fromEntries(pillars.map((pillar) => [pillar, 0]))

  return Object.fromEntries(pillars.map((pillar) => {
    const average = checkins.reduce((sum, checkin) => sum + pillarScore(checkin, pillar), 0) / checkins.length
    return [pillar, Math.round(average * 100)]
  }))
}

export function deriveStats(userData, today = getLocalDateKey()) {
  const checkins = sortedCheckins(userData)
  const totalDays = checkins.length
  const totalPoints = checkins.reduce((sum, checkin) => sum + (Number(checkin.points) || 0), 0)
  const completedCycles = Math.floor(totalDays / 30)
  const daysInCurrentCycle = totalDays % 30
  const currentCycle = completedCycles + 1
  const currentCycleCheckins = checkins.slice(-30)

  return {
    totalDays,
    totalPoints,
    completedCycles,
    currentCycle,
    daysInCurrentCycle,
    nextDayInCycle: daysInCurrentCycle + 1,
    progressPercentage: Math.round((daysInCurrentCycle / 30) * 100),
    streak: calculateStreak(checkins, today),
    hasCheckinToday: Boolean(userData?.dailyProgress?.[today]),
    todayCheckin: userData?.dailyProgress?.[today] || null,
    pilarProgress: calculatePillarProgress(currentCycleCheckins),
  }
}

export function normalizeGoal(goal) {
  if (!goal || typeof goal !== 'object' || !goal.title?.trim()) return null
  const type = goal.type === 'result' ? 'result' : 'habit'
  const targetDays = Math.max(1, Number(goal.targetDays) || 30)

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
    ? Number(weightedCheckins[weightedCheckins.length - 1].gerenciamentoPeso.pesoKg)
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
    { id: 'first_day', name: 'Primeiro Passo', description: 'Registre seu primeiro dia.', earned: stats.totalDays >= 1 },
    { id: 'week_warrior', name: 'Semana em Movimento', description: 'Mantenha 7 dias consecutivos.', earned: stats.streak >= 7 },
    { id: 'month_master', name: 'Ciclo Completo', description: 'Registre 30 dias.', earned: stats.totalDays >= 30 },
    { id: 'point_collector', name: 'Constância', description: 'Alcance 1.000 pontos de hábitos.', earned: stats.totalPoints >= 1000 },
    { id: 'consistency_king', name: 'Ritmo Sustentável', description: 'Mantenha 14 dias consecutivos.', earned: stats.streak >= 14 },
    { id: 'cycle_complete', name: 'Jornada Contínua', description: 'Conclua um ciclo de 30 dias.', earned: stats.completedCycles >= 1 },
  ]
}

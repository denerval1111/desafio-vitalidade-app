import { useState, useEffect } from 'react'

export function useLocalStorage(key, initialValue) {
  // Estado para armazenar o valor
  const [storedValue, setStoredValue] = useState(() => {
    try {
      // Obter do localStorage
      const item = window.localStorage.getItem(key)
      // Parse do JSON armazenado ou retorna o valor inicial
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      // Se erro, retorna o valor inicial
      console.log(error)
      return initialValue
    }
  })

  // Função para definir o valor
  const setValue = (value) => {
    try {
      // Permite que value seja uma função para que tenhamos a mesma API do useState
      const valueToStore = value instanceof Function ? value(storedValue) : value
      // Salva no estado
      setStoredValue(valueToStore)
      // Salva no localStorage
      window.localStorage.setItem(key, JSON.stringify(valueToStore))
    } catch (error) {
      console.log(error)
    }
  }

  return [storedValue, setValue]
}

// Hook específico para dados do Desafio Vitalidade
export function useVitalityData() {
  const [userData, setUserData] = useLocalStorage('vitality_user_data', {
    profile: {
      name: '',
      age: '',
      objectives: []
    },
    currentDay: 1,
    currentCycle: 1,
    totalDays: 0,
    dailyProgress: {},
    totalPoints: 0,
    hasCompletedOnboarding: false,
    startDate: null,
    longTermData: {
      customGoals: [],
      completedCycles: 0
    }
  })

  // Função para completar onboarding
  const completeOnboarding = (profile) => {
    setUserData(prev => ({
      ...prev,
      profile,
      hasCompletedOnboarding: true,
      startDate: new Date().toISOString()
    }))
  }

  // Função para salvar check-in diário
  const saveCheckin = (day, checkinData) => {
    let points = 0
    
    // Calcular pontos por pilar
    // Medicina Regenerativa
    if (checkinData.medicinaRegenerativa.jejum) points += 10
    if (checkinData.medicinaRegenerativa.sono) points += 10
    if (checkinData.medicinaRegenerativa.hidratacao) points += 10
    
    // Nutrologia
    if (checkinData.nutrologia.refeicao) points += 10
    if (checkinData.nutrologia.suplementos) points += 10
    if (checkinData.nutrologia.exercicio) points += 10
    
    // Psiquiatria
    if (checkinData.psiquiatria.meditacao) points += 10
    if (checkinData.psiquiatria.gratidao) points += 10
    points += checkinData.psiquiatria.humor * 2 // 2-10 pontos baseado no humor
    
    // Gerenciamento do Peso
    if (checkinData.gerenciamentoPeso.pesagem) points += 10
    if (checkinData.gerenciamentoPeso.controleAlimentar) points += 10

    setUserData(prev => {
      const newDailyProgress = {
        ...prev.dailyProgress,
        [day]: {
          ...checkinData,
          points,
          date: new Date().toISOString()
        }
      }

      const newTotalDays = Math.max(prev.totalDays, day)
      const newCurrentCycle = Math.ceil(newTotalDays / 30)
      const completedCycles = Math.floor(newTotalDays / 30)

      return {
        ...prev,
        dailyProgress: newDailyProgress,
        totalPoints: prev.totalPoints + points,
        totalDays: newTotalDays,
        currentCycle: newCurrentCycle,
        longTermData: {
          ...prev.longTermData,
          completedCycles
        }
      }
    })

    return points
  }

  // Função para adicionar meta personalizada
  const addCustomGoal = (goal) => {
    const newGoal = {
      id: Date.now(),
      ...goal,
      createdAt: new Date().toISOString(),
      completed: false
    }

    setUserData(prev => ({
      ...prev,
      longTermData: {
        ...prev.longTermData,
        customGoals: [...prev.longTermData.customGoals, newGoal]
      }
    }))
  }

  // Função para obter estatísticas
  const getStats = () => {
    const currentCycleDays = userData.totalDays % 30
    const progressPercentage = Math.round((currentCycleDays / 30) * 100)
    
    // Calcular streak (dias consecutivos)
    let streak = 0
    for (let i = userData.totalDays; i >= 1; i--) {
      if (userData.dailyProgress[i]) {
        streak++
      } else {
        break
      }
    }

    // Calcular progresso por pilar no ciclo atual
    const currentCycleStart = Math.floor((userData.totalDays - 1) / 30) * 30 + 1
    const currentCycleEnd = userData.totalDays
    
    let pilarProgress = {
      medicinaRegenerativa: 0,
      nutrologia: 0,
      psiquiatria: 0,
      gerenciamentoPeso: 0
    }

    let daysInCurrentCycle = 0
    for (let day = currentCycleStart; day <= currentCycleEnd; day++) {
      const dayData = userData.dailyProgress[day]
      if (dayData) {
        daysInCurrentCycle++
        
        // Medicina Regenerativa (máximo 3 atividades)
        let mrCount = 0
        if (dayData.medicinaRegenerativa.jejum) mrCount++
        if (dayData.medicinaRegenerativa.sono) mrCount++
        if (dayData.medicinaRegenerativa.hidratacao) mrCount++
        pilarProgress.medicinaRegenerativa += (mrCount / 3) * 100
        
        // Nutrologia (máximo 3 atividades)
        let nutCount = 0
        if (dayData.nutrologia.refeicao) nutCount++
        if (dayData.nutrologia.suplementos) nutCount++
        if (dayData.nutrologia.exercicio) nutCount++
        pilarProgress.nutrologia += (nutCount / 3) * 100
        
        // Psiquiatria (2 atividades + humor)
        let psyCount = 0
        if (dayData.psiquiatria.meditacao) psyCount++
        if (dayData.psiquiatria.gratidao) psyCount++
        psyCount += (dayData.psiquiatria.humor / 5) // humor normalizado
        pilarProgress.psiquiatria += (psyCount / 3) * 100
        
        // Gerenciamento do Peso (máximo 2 atividades)
        let pesoCount = 0
        if (dayData.gerenciamentoPeso.pesagem) pesoCount++
        if (dayData.gerenciamentoPeso.controleAlimentar) pesoCount++
        pilarProgress.gerenciamentoPeso += (pesoCount / 2) * 100
      }
    }

    // Calcular média por pilar
    if (daysInCurrentCycle > 0) {
      pilarProgress.medicinaRegenerativa = Math.round(pilarProgress.medicinaRegenerativa / daysInCurrentCycle)
      pilarProgress.nutrologia = Math.round(pilarProgress.nutrologia / daysInCurrentCycle)
      pilarProgress.psiquiatria = Math.round(pilarProgress.psiquiatria / daysInCurrentCycle)
      pilarProgress.gerenciamentoPeso = Math.round(pilarProgress.gerenciamentoPeso / daysInCurrentCycle)
    }

    return {
      totalDays: userData.totalDays,
      currentCycle: userData.currentCycle,
      currentCycleDays,
      progressPercentage,
      totalPoints: userData.totalPoints,
      streak,
      completedCycles: userData.longTermData.completedCycles,
      pilarProgress
    }
  }

  // Função para obter conquistas
  const getAchievements = () => {
    const stats = getStats()
    
    return [
      {
        id: 'first_day',
        name: 'Primeiro Passo',
        description: 'Complete seu primeiro dia',
        earned: stats.totalDays >= 1
      },
      {
        id: 'week_warrior',
        name: 'Guerreiro da Semana',
        description: 'Complete 7 dias consecutivos',
        earned: stats.streak >= 7
      },
      {
        id: 'month_master',
        name: 'Mestre do Mês',
        description: 'Complete 30 dias',
        earned: stats.totalDays >= 30
      },
      {
        id: 'point_collector',
        name: 'Colecionador',
        description: 'Acumule 1000 pontos',
        earned: stats.totalPoints >= 1000
      },
      {
        id: 'consistency_king',
        name: 'Rei da Consistência',
        description: 'Mantenha 14 dias consecutivos',
        earned: stats.streak >= 14
      },
      {
        id: 'cycle_complete',
        name: 'Ciclo Completo',
        description: 'Complete um ciclo de 30 dias',
        earned: stats.completedCycles >= 1
      }
    ]
  }

  // Função para obter metas de longo prazo
  const getLongTermGoals = () => {
    const stats = getStats()
    
    const predefinedGoals = [
      {
        id: 'goal_30',
        title: '30 dias',
        targetDays: 30,
        progress: Math.min(100, Math.round((stats.totalDays / 30) * 100)),
        completed: stats.totalDays >= 30,
        remainingDays: Math.max(0, 30 - stats.totalDays)
      },
      {
        id: 'goal_90',
        title: '90 dias',
        targetDays: 90,
        progress: Math.min(100, Math.round((stats.totalDays / 90) * 100)),
        completed: stats.totalDays >= 90,
        remainingDays: Math.max(0, 90 - stats.totalDays)
      },
      {
        id: 'goal_180',
        title: '180 dias',
        targetDays: 180,
        progress: Math.min(100, Math.round((stats.totalDays / 180) * 100)),
        completed: stats.totalDays >= 180,
        remainingDays: Math.max(0, 180 - stats.totalDays)
      },
      {
        id: 'goal_360',
        title: '360 dias',
        targetDays: 360,
        progress: Math.min(100, Math.round((stats.totalDays / 360) * 100)),
        completed: stats.totalDays >= 360,
        remainingDays: Math.max(0, 360 - stats.totalDays)
      }
    ]

    const customGoals = userData.longTermData.customGoals.map(goal => ({
      ...goal,
      progress: Math.min(100, Math.round((stats.totalDays / goal.targetDays) * 100)),
      completed: stats.totalDays >= goal.targetDays,
      remainingDays: Math.max(0, goal.targetDays - stats.totalDays)
    }))

    return {
      predefined: predefinedGoals,
      custom: customGoals
    }
  }

  // Função para resetar dados
  const resetData = () => {
    setUserData({
      profile: {
        name: '',
        age: '',
        objectives: []
      },
      currentDay: 1,
      currentCycle: 1,
      totalDays: 0,
      dailyProgress: {},
      totalPoints: 0,
      hasCompletedOnboarding: false,
      startDate: null,
      longTermData: {
        customGoals: [],
        completedCycles: 0
      }
    })
  }

  return {
    userData,
    completeOnboarding,
    saveCheckin,
    addCustomGoal,
    getStats,
    getAchievements,
    getLongTermGoals,
    resetData
  }
}


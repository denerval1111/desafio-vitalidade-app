import { useState } from 'react'
import { CheckCircle2, X } from 'lucide-react'
import { Dashboard } from '@/components/app/Dashboard.jsx'
import { Checkin } from '@/components/app/Checkin.jsx'
import { Goals } from '@/components/app/Goals.jsx'
import { Navigation } from '@/components/app/Navigation.jsx'
import { Onboarding } from '@/components/app/Onboarding.jsx'
import { Profile } from '@/components/app/Profile.jsx'
import { ProgressView } from '@/components/app/ProgressView.jsx'
import { WeekProgram } from '@/components/app/WeekProgram.jsx'
import { useVitalityData } from '@/hooks/useVitalityData.js'
import { createEmptyCheckin, getLocalDateKey, normalizeCheckin } from '@/lib/vitality.js'
import './App.css'

function App() {
  const {
    userData,
    completeOnboarding,
    saveCheckin,
    saveWeeklyReview,
    addCustomGoal,
    resetData,
    importData,
    stats,
    achievements,
    longTermGoals,
  } = useVitalityData()
  const [currentView, setCurrentView] = useState(userData.hasCompletedOnboarding ? 'dashboard' : 'onboarding')
  const [onboardingStep, setOnboardingStep] = useState(0)
  const [profileForm, setProfileForm] = useState({ name: '', age: '', objectives: [] })
  const [checkinData, setCheckinData] = useState(createEmptyCheckin)
  const [notice, setNotice] = useState('')
  const [resetPending, setResetPending] = useState(false)
  const today = getLocalDateKey()

  const handleObjectiveToggle = (objective) => {
    setProfileForm((current) => ({
      ...current,
      objectives: current.objectives.includes(objective)
        ? current.objectives.filter((item) => item !== objective)
        : [...current.objectives, objective],
    }))
  }

  const navigate = (view) => {
    if (view === 'checkin') {
      setCheckinData(normalizeCheckin(userData.dailyProgress?.[today]))
    }
    setCurrentView(view)
  }

  const handleCompleteOnboarding = (profile) => {
    completeOnboarding(profile)
    setCurrentView('dashboard')
    setNotice('Seu perfil foi salvo neste dispositivo. Você já pode iniciar a jornada.')
  }

  const handleSaveCheckin = () => {
    const result = saveCheckin(today, checkinData)
    setCurrentView('dashboard')
    setNotice(`${result.feedback.title}. ${result.feedback.message}`)
  }

  const handleSaveWeeklyReview = (reviewKey, review) => {
    saveWeeklyReview(reviewKey, review)
    setNotice(review.dismissed ? 'Tudo bem. Você pode fazer a reflexão em outro momento.' : 'Sua reflexão foi guardada neste dispositivo.')
  }

  const handleExport = () => {
    const data = JSON.stringify(userData, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `desafio-vitalidade-backup-${today}.json`
    document.body.appendChild(link)
    link.click()
    link.remove()
    URL.revokeObjectURL(url)
    setNotice('Backup baixado. Guarde o arquivo em local seguro.')
  }

  const handleImportFile = async (file) => {
    try {
      const contents = await file.text()
      const parsed = JSON.parse(contents)
      if (!parsed || typeof parsed !== 'object') throw new Error('Formato inválido')
      importData(parsed)
      setCurrentView(parsed.hasCompletedOnboarding ? 'dashboard' : 'onboarding')
      setNotice('Backup importado neste dispositivo.')
    } catch {
      setNotice('Não foi possível importar este arquivo. Escolha um backup do Desafio Vitalidade em formato JSON.')
    }
  }

  const handleReset = () => {
    resetData()
    setResetPending(false)
    setCurrentView('onboarding')
    setOnboardingStep(0)
    setProfileForm({ name: '', age: '', objectives: [] })
    setCheckinData(createEmptyCheckin())
    setNotice('Os dados locais foram apagados deste navegador.')
  }

  if (!userData.hasCompletedOnboarding) {
    return <Onboarding step={onboardingStep} setStep={setOnboardingStep} profileForm={profileForm} setProfileForm={setProfileForm} onObjectiveToggle={handleObjectiveToggle} onComplete={handleCompleteOnboarding} />
  }

  const screens = {
    dashboard: <Dashboard userData={userData} stats={stats} onNavigate={navigate} onSaveWeeklyReview={handleSaveWeeklyReview} />,
    checkin: <Checkin checkinData={checkinData} setCheckinData={setCheckinData} onSave={handleSaveCheckin} isEditing={stats.hasCheckinToday} stats={stats} />,
    learn: <WeekProgram suggestedDay={(stats.totalDays % 30) + 1} />,
    progress: <ProgressView stats={stats} longTermGoals={longTermGoals} achievements={achievements} />,
    goals: <Goals longTermGoals={longTermGoals} onAddGoal={addCustomGoal} onNotice={setNotice} />,
    profile: <Profile userData={userData} stats={stats} onExport={handleExport} onImportFile={handleImportFile} onReset={handleReset} resetPending={resetPending} setResetPending={setResetPending} />,
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-sky-50">
      <div className="mx-auto min-h-screen max-w-md bg-white shadow-xl shadow-slate-200/50">
        {screens[currentView] || screens.dashboard}
        <Navigation currentView={currentView} onNavigate={navigate} />
        {notice && <div role="status" className="fixed left-1/2 top-4 z-50 flex w-[calc(100%-2rem)] max-w-md -translate-x-1/2 items-start gap-2 rounded-xl border border-emerald-200 bg-white p-3 text-sm text-slate-700 shadow-lg"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" aria-hidden="true" /><span className="flex-1">{notice}</span><button type="button" aria-label="Fechar mensagem" onClick={() => setNotice('')} className="rounded p-1 text-slate-500 hover:bg-slate-100"><X className="h-4 w-4" aria-hidden="true" /></button></div>}
      </div>
    </div>
  )
}

export default App

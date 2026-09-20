import { useMemo, useState } from 'react'
import { Award, CalendarDays, Flame, HeartPulse, History, Layers3, TrendingUp } from 'lucide-react'
import { Badge } from '@/components/ui/badge.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Progress } from '@/components/ui/progress.jsx'

const views = [
  { id: 'cycle', label: 'Ciclo', icon: Layers3 },
  { id: 'pillars', label: 'Pilares', icon: HeartPulse },
  { id: 'history', label: 'Histórico', icon: History },
]

const pillarColors = {
  medicinaRegenerativa: 'bg-emerald-500',
  nutrologia: 'bg-sky-500',
  psiquiatria: 'bg-violet-500',
  gerenciamentoPeso: 'bg-amber-500',
}

function StatCell({ value, label, detail }) {
  return <div className="text-center"><strong className="block text-2xl text-slate-800">{value}</strong><span className="text-xs text-slate-500">{label}</span>{detail && <span className="mt-1 block text-[11px] text-slate-400">{detail}</span>}</div>
}

function CycleCalendar({ slots }) {
  return (
    <div className="grid grid-cols-5 gap-2" aria-label="Calendário do ciclo de 30 dias">
      {slots.map((slot) => {
        const filled = Boolean(slot.checkin)
        const dateLabel = slot.date ? new Date(`${slot.date}T12:00:00`).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }) : null
        return <div key={slot.slot} className={`min-h-16 rounded-xl border p-2 ${filled ? 'border-emerald-200 bg-emerald-50' : 'border-slate-200 bg-slate-50'}`}><div className="flex items-center justify-between"><span className={`text-xs font-semibold ${filled ? 'text-emerald-800' : 'text-slate-500'}`}>Dia {slot.slot}</span>{filled && <span aria-label={`${slot.points} pontos`} className="h-2 w-2 rounded-full bg-emerald-500" />}</div><p className="mt-2 text-xs text-slate-500">{filled ? dateLabel : 'Livre'}</p></div>
      })}
    </div>
  )
}

function CyclePanel({ stats, longTermGoals }) {
  const nextGoal = longTermGoals.predefined.find((goal) => !goal.completed)
  const recentMessage = stats.recentDays === 0
    ? 'Seu ritmo pode recomeçar quando fizer sentido para você.'
    : `${stats.recentDays} dia${stats.recentDays === 1 ? '' : 's'} registrado${stats.recentDays === 1 ? '' : 's'} nos últimos 7 dias.`

  return (
    <div className="space-y-4">
      <Card className="border-emerald-100 bg-gradient-to-br from-emerald-50 to-cyan-50"><CardContent className="p-5"><div className="flex items-start justify-between gap-4"><div><p className="text-sm font-medium text-emerald-800">Ciclo {stats.currentCycle}</p><h2 className="mt-1 text-2xl font-bold text-slate-900">{stats.daysInCurrentCycle} de 30 dias registrados</h2><p className="mt-2 text-sm text-slate-600">{recentMessage}</p></div><Badge variant="outline" className="border-emerald-300 bg-white text-emerald-800">{stats.progressPercentage}%</Badge></div><Progress value={stats.progressPercentage} className="mt-4 h-2.5" /></CardContent></Card>
      <Card><CardContent className="grid grid-cols-3 gap-3 p-4"><StatCell value={stats.streak} label="Sequência" /><StatCell value={stats.longestStreak} label="Melhor ritmo" /><StatCell value={stats.totalDays} label="Registros" detail="na jornada" /></CardContent></Card>
      {nextGoal && <Card><CardContent className="flex items-center gap-3 p-4"><TrendingUp className="h-5 w-5 shrink-0 text-amber-600" aria-hidden="true" /><div><p className="font-semibold text-slate-800">Próximo marco: {nextGoal.targetDays} dias</p><p className="text-sm text-slate-500">Faltam {nextGoal.remainingDays} registros para este marco de consistência.</p></div></CardContent></Card>}
      <Card><CardHeader><CardTitle className="flex items-center gap-2 text-base"><CalendarDays className="h-5 w-5 text-emerald-600" aria-hidden="true" />Calendário do ciclo</CardTitle><p className="text-sm font-normal leading-relaxed text-slate-500">Cada marca representa um dia com check-in. Dias livres não são falhas: são apenas dias sem registro.</p></CardHeader><CardContent><CycleCalendar slots={stats.currentCycleSlots} /></CardContent></Card>
    </div>
  )
}

function PillarsPanel({ stats }) {
  const top = stats.topPillar
  return (
    <div className="space-y-4">
      <Card className="border-sky-100 bg-sky-50"><CardContent className="p-4"><p className="text-sm leading-relaxed text-sky-950">{top ? <>Neste ciclo, <strong>{top.shortLabel.toLowerCase()}</strong> esteve mais presente. O objetivo não é equilibrar tudo perfeitamente, e sim perceber o que você gostaria de acolher a seguir.</> : <>Quando houver registros, esta área mostrará como os quatro pilares estiveram presentes no seu ciclo.</>}</p></CardContent></Card>
      {Object.entries(stats.pillarDetails).map(([key, detail]) => <Card key={key}><CardContent className="p-4"><div className="mb-2 flex items-start justify-between gap-3"><div><p className="font-semibold text-slate-800">{detail.label}</p><p className="mt-1 text-sm text-slate-500">Presente em {detail.activeDays} de {stats.daysInCurrentCycle} dias registrados</p></div><Badge variant="outline">{detail.presencePercentage}%</Badge></div><div className="h-2.5 overflow-hidden rounded-full bg-slate-100"><div className={`h-full rounded-full ${pillarColors[key]}`} style={{ width: `${detail.presencePercentage}%` }} /></div><p className="mt-3 text-xs text-slate-500">{detail.practiceCount} prática{detail.practiceCount === 1 ? '' : 's'} registrada{detail.practiceCount === 1 ? '' : 's'} neste pilar.</p></CardContent></Card>)}
    </div>
  )
}

function HistoryPanel({ stats }) {
  const visibleWeeks = stats.weeklySummaries.filter((week) => week.registeredDays > 0)
  return (
    <div className="space-y-4">
      <Card><CardHeader><CardTitle className="flex items-center gap-2 text-base"><CalendarDays className="h-5 w-5 text-emerald-600" aria-hidden="true" />Evolução neste ciclo</CardTitle></CardHeader><CardContent>{visibleWeeks.length === 0 ? <p className="text-center text-sm leading-relaxed text-slate-500">Seu histórico começa com um registro possível. Quando você salvar o primeiro check-in, verá a evolução por semana aqui.</p> : <div className="space-y-4">{visibleWeeks.map((week) => <div key={week.week} className="border-b border-slate-100 pb-4 last:border-0 last:pb-0"><div className="flex items-start justify-between gap-3"><div><p className="font-semibold text-slate-800">{week.label} <span className="font-normal text-slate-500">· {week.range}</span></p><p className="mt-1 text-sm text-slate-500">{week.registeredDays} dia{week.registeredDays === 1 ? '' : 's'} registrado{week.registeredDays === 1 ? '' : 's'} · {week.points} pontos</p></div><Badge variant="outline">{week.topPillar ? week.topPillar.shortLabel : 'Em construção'}</Badge></div></div>)}</div>}</CardContent></Card>
      <Card><CardHeader><CardTitle className="flex items-center gap-2 text-base"><History className="h-5 w-5 text-sky-600" aria-hidden="true" />Ciclos anteriores</CardTitle></CardHeader><CardContent>{stats.cycleHistory.length === 0 ? <p className="text-center text-sm text-slate-500">Nenhum ciclo registrado ainda.</p> : <div className="space-y-3">{stats.cycleHistory.map((cycle) => <div key={cycle.cycle} className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 p-3"><div><p className="font-semibold text-slate-800">Ciclo {cycle.cycle}</p><p className="mt-1 text-xs text-slate-500">{cycle.registeredDays} de 30 registros · {cycle.points} pontos</p></div><Badge variant={cycle.completed ? 'default' : 'outline'}>{cycle.completed ? 'Concluído' : 'Em andamento'}</Badge></div>)}</div>}</CardContent></Card>
    </div>
  )
}

export function ProgressView({ stats, longTermGoals, achievements }) {
  const [activeView, setActiveView] = useState('cycle')
  const earnedCount = useMemo(() => achievements.filter((achievement) => achievement.earned).length, [achievements])

  return (
    <main className="p-6 pb-24">
      <header className="mb-5 text-center"><h1 className="text-2xl font-bold text-slate-900">Seu progresso</h1><p className="mt-1 text-sm text-slate-600">Uma visão para reconhecer continuidade, não para buscar perfeição.</p></header>
      <div className="mb-5 grid grid-cols-3 rounded-xl border border-slate-200 bg-slate-50 p-1" role="tablist" aria-label="Visões de progresso">{views.map(({ id, label, icon: Icon }) => <button key={id} type="button" role="tab" aria-selected={activeView === id} onClick={() => setActiveView(id)} className={`flex min-h-11 items-center justify-center gap-1 rounded-lg px-2 text-xs font-semibold transition ${activeView === id ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}><Icon className="h-4 w-4" aria-hidden="true" />{label}</button>)}</div>
      {activeView === 'cycle' && <CyclePanel stats={stats} longTermGoals={longTermGoals} />}
      {activeView === 'pillars' && <PillarsPanel stats={stats} />}
      {activeView === 'history' && <HistoryPanel stats={stats} />}
      <Card className="mt-4"><CardHeader><CardTitle className="flex items-center gap-2 text-base"><Award className="h-5 w-5 text-amber-500" aria-hidden="true" />Conquistas em construção</CardTitle><p className="text-sm font-normal text-slate-500">{earnedCount} de {achievements.length} marcos reconhecidos até agora.</p></CardHeader><CardContent className="grid grid-cols-2 gap-3">{achievements.map((achievement) => <div key={achievement.id} className={`rounded-xl border p-3 ${achievement.earned ? 'border-emerald-200 bg-emerald-50' : 'border-slate-200 bg-slate-50'}`}><Badge variant={achievement.earned ? 'default' : 'outline'}>{achievement.earned ? 'Reconhecida' : 'Em construção'}</Badge><p className="mt-2 text-sm font-semibold text-slate-800">{achievement.name}</p><p className="mt-1 text-xs leading-relaxed text-slate-500">{achievement.description}</p></div>)}</CardContent></Card>
      {stats.streak > 0 && <div className="mt-4 flex items-center gap-2 rounded-xl bg-orange-50 p-3 text-sm text-orange-900"><Flame className="h-5 w-5" aria-hidden="true" /><span><strong>{stats.streak} dia{stats.streak === 1 ? '' : 's'} consecutivo{stats.streak === 1 ? '' : 's'}</strong> de prática registrada.</span></div>}
    </main>
  )
}

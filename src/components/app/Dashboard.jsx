import { Award, BookOpen, CheckCircle, TrendingUp } from 'lucide-react'
import { Badge } from '@/components/ui/badge.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent } from '@/components/ui/card.jsx'

function CycleProgress({ stats }) {
  const circumference = 2 * Math.PI * 54
  const offset = circumference * (1 - stats.progressPercentage / 100)
  return (
    <div className="relative mx-auto h-36 w-36">
      <svg className="h-36 w-36 -rotate-90" viewBox="0 0 120 120" aria-hidden="true">
        <circle cx="60" cy="60" r="54" fill="none" stroke="currentColor" strokeWidth="8" className="text-slate-100" />
        <circle cx="60" cy="60" r="54" fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset} className="text-emerald-500 transition-all" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <strong className="text-3xl text-slate-800">{stats.nextDayInCycle}</strong>
        <span className="text-xs text-slate-500">próximo de 30</span>
      </div>
    </div>
  )
}

export function Dashboard({ userData, stats, onNavigate }) {
  const nextGoal = [30, 90, 180, 360].find((goal) => goal > stats.totalDays)
  const date = new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })
  const checkinLabel = stats.hasCheckinToday ? 'Editar check-in de hoje' : 'Fazer check-in de hoje'

  return (
    <main className="p-6 pb-24">
      <header className="mb-5">
        <p className="capitalize text-sm text-slate-500">{date}</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">Olá, {userData.profile.name || 'você'}!</h1>
        <p className="mt-1 text-sm text-slate-600">Ciclo {stats.currentCycle} · {stats.totalDays} registro{stats.totalDays === 1 ? '' : 's'} na jornada</p>
      </header>

      <Card className="border-emerald-100 bg-gradient-to-br from-emerald-50 to-cyan-50 shadow-sm">
        <CardContent className="pt-6 text-center">
          <p className="text-sm font-medium text-emerald-800">Progresso do ciclo atual</p>
          <CycleProgress stats={stats} />
          <p className="text-sm text-slate-600">{stats.daysInCurrentCycle} de 30 dias registrados neste ciclo</p>
        </CardContent>
      </Card>

      <div className="mt-4 grid gap-3">
        <Button type="button" className="h-14 bg-emerald-600 text-base hover:bg-emerald-700" onClick={() => onNavigate('checkin')}>
          <CheckCircle className="mr-2 h-5 w-5" aria-hidden="true" />
          {checkinLabel}
        </Button>
        <div className="grid grid-cols-2 gap-3">
          <Button type="button" variant="outline" className="h-12" onClick={() => onNavigate('learn')}><BookOpen className="mr-2 h-4 w-4" aria-hidden="true" />Ver a semana</Button>
          <Button type="button" variant="outline" className="h-12" onClick={() => onNavigate('progress')}><TrendingUp className="mr-2 h-4 w-4" aria-hidden="true" />Meu progresso</Button>
        </div>
      </div>

      <section className="mt-5 grid grid-cols-3 gap-3" aria-label="Resumo da jornada">
        {[
          ['Registros', stats.totalDays],
          ['Pontos', stats.totalPoints],
          ['Sequência', stats.streak],
        ].map(([label, value]) => (
          <Card key={label}><CardContent className="p-3 text-center"><strong className="block text-xl text-slate-800">{value}</strong><span className="text-xs text-slate-500">{label}</span></CardContent></Card>
        ))}
      </section>

      {nextGoal && (
        <Card className="mt-5"><CardContent className="flex items-center justify-between p-4"><div><p className="font-semibold text-slate-800">Próximo marco: {nextGoal} dias</p><p className="text-sm text-slate-500">Faltam {nextGoal - stats.totalDays} registros</p></div><Badge variant="outline">{Math.round((stats.totalDays / nextGoal) * 100)}%</Badge></CardContent></Card>
      )}
      {stats.streak > 0 && <div className="mt-4 flex items-center gap-2 rounded-xl bg-orange-50 p-3 text-sm text-orange-900"><Award className="h-5 w-5" aria-hidden="true" /><span><strong>{stats.streak} dia{stats.streak === 1 ? '' : 's'} consecutivo{stats.streak === 1 ? '' : 's'}</strong> de prática registrada.</span></div>}
    </main>
  )
}

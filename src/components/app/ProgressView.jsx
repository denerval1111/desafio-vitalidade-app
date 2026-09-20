import { Award, CalendarDays } from 'lucide-react'
import { Badge } from '@/components/ui/badge.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Progress } from '@/components/ui/progress.jsx'

const pillars = [
  ['Medicina Regenerativa', 'medicinaRegenerativa', 'bg-emerald-500'],
  ['Nutrologia', 'nutrologia', 'bg-sky-500'],
  ['Psiquiatria', 'psiquiatria', 'bg-violet-500'],
  ['Gerenciamento do Peso', 'gerenciamentoPeso', 'bg-amber-500'],
]

export function ProgressView({ stats, longTermGoals, achievements }) {
  return (
    <main className="p-6 pb-24">
      <header className="mb-5 text-center"><h1 className="text-2xl font-bold text-slate-900">Seu progresso</h1><p className="mt-1 text-sm text-slate-600">Dados calculados a partir dos seus registros por data.</p></header>
      <Card className="mb-4"><CardContent className="grid grid-cols-3 gap-3 p-4 text-center"><div><strong className="block text-2xl text-slate-800">{stats.totalDays}</strong><span className="text-xs text-slate-500">Registros</span></div><div><strong className="block text-2xl text-slate-800">{stats.completedCycles}</strong><span className="text-xs text-slate-500">Ciclos</span></div><div><strong className="block text-2xl text-slate-800">{stats.totalPoints}</strong><span className="text-xs text-slate-500">Pontos</span></div></CardContent></Card>
      <Card className="mb-4"><CardHeader><CardTitle className="flex items-center gap-2 text-base"><CalendarDays className="h-5 w-5 text-emerald-600" aria-hidden="true" />Metas de consistência</CardTitle></CardHeader><CardContent className="space-y-4">{longTermGoals.predefined.map((goal) => <div key={goal.id}><div className="mb-1 flex justify-between gap-2 text-sm"><span className="font-medium text-slate-700">{goal.completed ? 'Concluída' : goal.title}</span><span className="text-slate-500">{goal.completed ? '100%' : `${goal.remainingDays} restantes`}</span></div><Progress value={goal.progress} className="h-2" /></div>)}</CardContent></Card>
      <Card className="mb-4"><CardHeader><CardTitle className="text-base">Equilíbrio dos pilares no ciclo atual</CardTitle></CardHeader><CardContent className="space-y-4">{pillars.map(([label, key, color]) => <div key={key}><div className="mb-1 flex justify-between text-sm"><span className="font-medium text-slate-700">{label}</span><span className="text-slate-500">{stats.pilarProgress[key]}%</span></div><div className="h-2 overflow-hidden rounded-full bg-slate-100"><div className={`h-full rounded-full ${color}`} style={{ width: `${stats.pilarProgress[key]}%` }} /></div></div>)}</CardContent></Card>
      <Card><CardHeader><CardTitle className="flex items-center gap-2 text-base"><Award className="h-5 w-5 text-amber-500" aria-hidden="true" />Conquistas</CardTitle></CardHeader><CardContent className="grid grid-cols-2 gap-3">{achievements.map((achievement) => <div key={achievement.id} className={`rounded-xl border p-3 ${achievement.earned ? 'border-emerald-200 bg-emerald-50' : 'border-slate-200 bg-slate-50'}`}><Badge variant={achievement.earned ? 'default' : 'outline'}>{achievement.earned ? 'Conquistada' : 'Em andamento'}</Badge><p className="mt-2 text-sm font-semibold text-slate-800">{achievement.name}</p><p className="mt-1 text-xs leading-relaxed text-slate-500">{achievement.description}</p></div>)}</CardContent></Card>
    </main>
  )
}

import { useEffect, useMemo, useState } from 'react'
import { Clock3, HeartHandshake, Moon, Sparkles, Sun } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { getStageForDay, journeyStages } from '@/content/journey.js'

function PracticeBlock({ icon: Icon, title, items, color }) {
  return (
    <section className={`rounded-xl p-4 ${color}`}>
      <h3 className="mb-3 flex items-center gap-2 font-semibold text-slate-800"><Icon className="h-5 w-5" aria-hidden="true" />{title}</h3>
      <ul className="space-y-2 text-sm leading-relaxed text-slate-700">
        {items.map((item) => <li key={item} className="flex gap-2"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-500" aria-hidden="true" />{item}</li>)}
      </ul>
    </section>
  )
}

function stageLabel(stage, index) {
  return stage.id === 'fechamento' ? 'Fechamento' : `Semana ${index + 1}`
}

export function WeekProgram({ suggestedDay }) {
  const initialStage = getStageForDay(suggestedDay)
  const [selectedStageId, setSelectedStageId] = useState(initialStage.id)
  const [selectedDay, setSelectedDay] = useState(suggestedDay)

  useEffect(() => {
    const suggestedStage = getStageForDay(suggestedDay)
    setSelectedStageId(suggestedStage.id)
    setSelectedDay(suggestedDay)
  }, [suggestedDay])

  const stage = useMemo(
    () => journeyStages.find((item) => item.id === selectedStageId) || initialStage,
    [initialStage, selectedStageId],
  )
  const day = stage.days.find((item) => item.day === selectedDay) || stage.days[0]

  function selectStage(nextStage) {
    setSelectedStageId(nextStage.id)
    setSelectedDay(nextStage.days[0].day)
  }

  return (
    <main className="p-6 pb-24">
      <header className="mb-5">
        <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">Jornada prática · Dia {day.day} de 30</span>
        <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-900">{stage.title}</h1>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">{stage.subtitle}</p>
      </header>

      <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs leading-relaxed text-amber-950"><strong>Uso responsável:</strong> {stage.safetyNote}</div>

      <section className="mb-5" aria-label="Etapas da jornada">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Escolha uma etapa</p>
        <div className="-mx-2 flex gap-2 overflow-x-auto px-2 pb-1" role="tablist" aria-label="Etapas da jornada de 30 dias">
          {journeyStages.map((item, index) => {
            const active = item.id === stage.id
            return <button key={item.id} type="button" role="tab" aria-selected={active} onClick={() => selectStage(item)} className={`min-w-fit rounded-xl border px-3 py-2 text-center text-xs font-semibold transition ${active ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-slate-200 bg-white text-slate-600 hover:border-emerald-300'}`}>{stageLabel(item, index)}</button>
          })}
        </div>
      </section>

      <div className="-mx-2 mb-5 flex gap-2 overflow-x-auto px-2 pb-1" role="tablist" aria-label={`Dias de ${stage.title}`}>
        {stage.days.map((item) => {
          const active = item.day === selectedDay
          return <button key={item.day} type="button" role="tab" aria-selected={active} onClick={() => setSelectedDay(item.day)} className={`min-w-14 rounded-xl border px-3 py-2 text-center text-xs font-semibold transition ${active ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-slate-200 bg-white text-slate-600 hover:border-emerald-300'}`}><span className="block">Dia</span><span className="text-base">{item.day}</span></button>
        })}
      </div>

      <Card className="border-emerald-100">
        <CardHeader>
          <p className="text-sm font-medium text-emerald-700">Dia {day.day} de 30</p>
          <CardTitle className="text-xl">{day.title}</CardTitle>
          <p className="text-sm leading-relaxed text-slate-600">{day.focus}</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <PracticeBlock icon={Sun} title="Manhã · prática possível" items={day.morning} color="bg-amber-50" />
          <PracticeBlock icon={Clock3} title="Ao longo do dia · pausas breves" items={day.micro} color="bg-sky-50" />
          <PracticeBlock icon={Moon} title="Fim do dia · encerramento" items={day.evening} color="bg-violet-50" />
          <section className="rounded-xl bg-emerald-50 p-4"><h3 className="mb-2 flex items-center gap-2 font-semibold text-emerald-900"><HeartHandshake className="h-5 w-5" aria-hidden="true" />Reflexão</h3><p className="text-sm leading-relaxed text-emerald-900">{day.reflection}</p></section>
        </CardContent>
      </Card>

      <div className="mt-5 rounded-xl border border-slate-200 bg-white p-4 text-sm leading-relaxed text-slate-600"><Sparkles className="mr-2 inline h-4 w-4 text-amber-500" aria-hidden="true" /><strong className="text-slate-800">Regra da jornada:</strong> escolha o possível hoje. O check-in serve para reconhecer o que aconteceu, não para cobrar perfeição.</div>
    </main>
  )
}
